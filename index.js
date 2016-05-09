// see http://dontkry.com/posts/code/using-npm-on-the-client-side.html

var MAPBOX_TOKEN = "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2luejZlYTV5MThyb3VnbHlwNDJrZmwxcCJ9.NmZCqGSgzu07RUv8y3fIdg";

var fortyTwo = require('./forty-two.js');
var RouteOverlayExample = require('./routes.js');
var r = require('r-dom');
var result = fortyTwo(window.location);
console.log("Result: ", result);

import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
console.log("OK");

var React = require("./node_modules/react/");
console.log("react");
var ReactDOM = require("./node_modules/react-dom/");
console.log("ReactDOM");

var MyGraph = React.createClass({
    render: function() {
        return (
            <XYPlot width={300} height={300}>
                <HorizontalGridLines />
                <LineSeries
                    data={[
                {x: 1, y: 10},
                {x: 2, y: 5},
                {x: 3, y: 15}
                ]}/>
                <XAxis />
                <YAxis />
            </XYPlot>
        );
    }
});

var MapGL = require('react-map-gl');

var MyMap = React.createClass({
    render: function () {

        return (
            <MapGL mapboxApiAccessToken={ MAPBOX_TOKEN }
                width={400}
                height={400}
                latitude={37.78}
                longitude={-122.5}
                zoom={11}
                onChangeViewport={(viewport) => {
                    var {latitude, longitude, zoom} = viewport;
                    // Optionally call `setState` and use the state to update the map.
                }}
            />
        );
    }
});

// ReactDOM.render(
//     <MyGraph />,
//     document.getElementById('graph')
// );

// ReactDOM.render(
//     <MyMap />,
//     document.getElementById('map')
// );

var App = React.createClass({

    displayName: 'App',

    render: function render() {
        var params = {
            width: 900,
            height: 600,
            style: { float: 'left' },
            mapboxApiAccessToken: MAPBOX_TOKEN
        };
        return r.div([r(RouteOverlayExample, params)]);
    }
});

var container = document.createElement("div");
document.body.appendChild(container);
ReactDOM.render(r(App), container);
