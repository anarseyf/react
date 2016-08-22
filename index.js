// see http://dontkry.com/posts/code/using-npm-on-the-client-side.html

var MAPBOX_TOKEN = "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2luejZlYTV5MThyb3VnbHlwNDJrZmwxcCJ9.NmZCqGSgzu07RUv8y3fIdg";

var RouteOverlayExample = require('./routes.js');
var r = require('r-dom');
var d3 = require('d3');

import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';

var React = require("./node_modules/react/");
var ReactDOM = require("./node_modules/react-dom/");

var files =["Move_2016_07_31_06_23_53_Running.gpx",
            "Move_2016_04_21_19_07_52_Running.gpx",
            "Move_2016_04_19_19_18_27_Running.gpx",
            "Move_2016_04_17_18_53_00_Running.gpx",
            "Move_2016_04_16_18_58_28_Running.gpx",
            "Move_2016_04_12_19_15_54_Running.gpx"];

var fileNames = files.map(function (file) { return "./data/" + file; });
var runs = [];
var selectedRunIndex = 0;
var appContainer;
var graphInstance;

var getRun = function (fileName) {
    d3.xml(fileName, function (error, data) {

        var nodes = data.querySelectorAll("trkpt");
        var filteredNodes = [].filter.call(nodes,
            function (point, i) { return i % 10 === 0; }); // TODO

        var route = [].map.call(filteredNodes, function(node) {
            var measurements = {};
            [].forEach.call(node.querySelector("extensions").getElementsByTagName("*"), function (n) {
                var key;
                if (n.prefix === "gpxdata") {
                    key = n.nodeName.slice("gpxdata:".length);
                    measurements[key] = +n.textContent;
                }
                else if (n.nodeName === "gpxtpx:hr") {
                    key = n.nodeName.slice("gpxtpx:".length);
                    measurements[key] = +n.textContent;
                }
            });
            return {
                coordinates: [ +node.getAttribute("lon"), +node.getAttribute("lat") ],
                measurements: measurements
            };
        });

        var date = new Date(data.querySelector("time").textContent);

        var run = {
            fileName: fileName,
            date: date,
            route: route
        };
        runs.push(run);

        renderIfReady();

    }.bind(this));
};

var appHandleSelectedRun = function (i) {
    selectedRunIndex = i;
    ReactDOM.render(r(App), appContainer);
    graphInstance.triggerUpdate();
};

var App = React.createClass({

    displayName: 'App',

    handleSelectedRun: appHandleSelectedRun,

    render: function render() {
        var params = {
            width: 600,
            height: 400,
            style: { float: 'left' },
            mapboxApiAccessToken: MAPBOX_TOKEN,
            runs: runs,
            selectedRunIndex: selectedRunIndex
        };
        return r.div([r(RouteOverlayExample, params)]);
    }
});

var MyGraph = React.createClass({

    _computeState: function () {
        var route = runs[selectedRunIndex].route;

        var types = Object.keys(route[0].measurements);
        var dataByType = {};
        types.forEach(function (type) {
            dataByType[type] = route.map(function (datum, i) {
                return { x: i, y: datum.measurements[type] }
            });
        });
        var selectedType = types[0];
        return {
            types: types,
            selectedType: selectedType,
            dataByType: dataByType,
            data: dataByType[selectedType]
        }
    },

    getInitialState: function () {
        return this._computeState();
    },

    handleClick: function (type) {
        this.setState({ selectedType: type, data: this.state.dataByType[type] });
    },

    triggerUpdate: function () {
        this.setState(this._computeState());
    },

    render: function() {

        var animation = { duration: 500 };
        var types = this.state.types;
        var data = this.state.data;
        var margin = {left: 60, right: 0, top: 10, bottom: 10};

        var buttons = types.map(function (type, i) {
            var className = "c-type-button " + (type === this.state.selectedType ? " c-selected" : "");
            return (<div className={ className }
                         onClick={ this.handleClick.bind(this, type) } key={ i }>{ type }</div>);
        }, this);
        
        // <HorizontalGridLines />
        // <XAxis />
        return (
            <div>
                <XYPlot width={300} height={100} animation={animation} margin={margin}>
                    <YAxis ticks={3} />
                    <LineSeries data={ data } />
                </XYPlot>
                <div>{ buttons }</div>
            </div>
        );
    }
});

var MyList = React.createClass({

    getInitialState: function () {
        return {
            selectedRunIndex: 0
        }
    },

    handleClick: function (i) {
        this.props.handleSelectedRun(i);
        this.setState({ selectedRunIndex: i });
    },

    render: function () {
        var divs = runs.map(function (run, i) {
            var date = run.date,
                distance = run.route[run.route.length - 1].measurements.distance / 1600, // meters -> miles
                speed = run.route.map(function(d) { return d.measurements.speed; }), // meters/sec
                avgSpeed = d3.mean(speed) * 3600 / 1600, // mph
                hr = run.route.map(function(d) { return d.measurements.hr; }), // bpm
                avgHR = d3.mean(hr),
                formatter = d3.format(".2n"),
                fDistance = formatter(distance),
                fAvgSpeed = formatter(avgSpeed),
                fAvgHR = d3.round(avgHR);

            var className = "c-route" + (i === this.state.selectedRunIndex ? " c-selected" : "");
            return (
                <div className={ className }
                     key={ i }
                     onClick={ this.handleClick.bind(this, i) }>
                    <div>{ date.toDateString() }</div>
                    <div><strong> { fDistance }</strong> miles,
                        <strong> { fAvgSpeed }</strong> mph,
                        <strong> { fAvgHR }</strong> bpm</div>
                </div>);
        }, this);
        return (<div>{ divs }</div>);
    }
});

var renderIfReady = function () {
    if (runs.length === fileNames.length) {
        appContainer = document.createElement("div");
        document.getElementById("map").appendChild(appContainer);
        ReactDOM.render(r(App), appContainer);

        graphInstance = ReactDOM.render(
            <MyGraph />,
            document.getElementById('graph')
        );

        ReactDOM.render(
            <MyList handleSelectedRun={ appHandleSelectedRun } />,
            document.getElementById('list')
        );
    }
};

fileNames.forEach(getRun);
