// see http://dontkry.com/posts/code/using-npm-on-the-client-side.html

var MAPBOX_TOKEN = "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2luejZlYTV5MThyb3VnbHlwNDJrZmwxcCJ9.NmZCqGSgzu07RUv8y3fIdg";

var RouteOverlayExample = require('./routes.js');
var r = require('r-dom');
var d3 = require('d3');
var runs = [];

import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
console.log("OK");

var React = require("./node_modules/react/");
console.log("react");
var ReactDOM = require("./node_modules/react-dom/");
console.log("ReactDOM");

var MapGL = require('react-map-gl');
var fileNames = ["./data/run1.gpx", "./data/run2.gpx"];

var getRun = function (fileName) {
    d3.xml(fileName, function (error, data) {

        var nodes = data.querySelectorAll("trkpt");
        var filteredNodes = [].filter.call(nodes,
            function (point, i) { return i % 100 === 0; }); // TODO - remove

        var run = [].map.call(filteredNodes, function(node) {
            var measurements = {};
            [].forEach.call(node.querySelector("extensions").getElementsByTagName("*"), function (n) {
                // console.debug("prefix = " + n.prefix + ", name = " + n.nodeName + ", value = " + n.textContent);
                var key;
                if (n.prefix === "gpxdata") {
                    key = n.nodeName.slice("gpxdata:".length);
                    measurements[key] = +n.textContent;
                }
                // else if (n.prefix === "gpxtpx") { // TODO
                //     key = n.nodeName.slice("gpxtpx:".length);
                //     measurements[key] = +n.textContent;
                // }
            });
            return {
                coordinates: [ +node.getAttribute("lon"), +node.getAttribute("lat") ],
                measurements: measurements
            };
        });

        console.debug("run: " + JSON.stringify(run, null, 4));
        runs.push(run);

        renderIfReady();

    }.bind(this));
};

var App = React.createClass({

    displayName: 'App',

    render: function render() {
        var params = {
            width: 800,
            height: 400,
            style: { float: 'left' },
            mapboxApiAccessToken: MAPBOX_TOKEN,
            runs: runs
        };
        return r.div([r(RouteOverlayExample, params)]);
    }
});

var MyGraph = React.createClass({

    getInitialState: function () {

        var run = runs[0];

        var types = Object.keys(run[0].measurements);
        var dataByType = {};
        types.forEach(function (type) {
            dataByType[type] = run.map(function (datum, i) {
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

    handleClick: function (type) {
        console.debug("type = " + type);
        this.setState({ selectedType: type, data: this.state.dataByType[type] });
    },

    render: function() {

        var animation = { duration: 500 };
        var types = this.state.types;
        var data = this.state.data;

        var buttons = types.map(function (type, i) {
            return (<div className="c-type-button"
                onClick={ this.handleClick.bind(this, type) } key={ i }>{ type }</div>);
        }, this);

        return (
            <div>
                <XYPlot width={300} height={100} animation={animation}>
                    <HorizontalGridLines />
                    <LineSeries data={ data } />
                    <XAxis />
                    <YAxis />
                </XYPlot>
                <div>{ buttons }</div>
            </div>
        );
    }
});

var renderIfReady = function () {
    if (runs.length === fileNames.length) {
        var container = document.createElement("div");
        document.body.appendChild(container);
        ReactDOM.render(r(App), container);

        ReactDOM.render(
            <MyGraph />,
            document.getElementById('graph')
        );
    }
};

fileNames.forEach(getRun);
