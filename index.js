// see http://dontkry.com/posts/code/using-npm-on-the-client-side.html

var fortyTwo = require('./forty-two.js');
var result = fortyTwo(window.location);
console.log("Result: ", result);

import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis';
console.log("OK");

var React = require("./node_modules/react/");
console.log("react");
var ReactDOM = require("./node_modules/react-dom/");
console.log("ReactDOM");

var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});
ReactDOM.render(
    <CommentBox />,
    document.getElementById('example')
);

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

ReactDOM.render(
    <MyGraph />,
    document.getElementById('vis')
);

var MapGL = require('react-map-gl');

//<MapGL width={400} height={400} latitude={37.7577} longitude={-122.4376}
//  zoom={8} onChangeViewport={(viewport) => {
//    var {latitude, longitude, zoom} = viewport;
//    // Optionally call `setState` and use the state to update the map.
//  }}
///>
