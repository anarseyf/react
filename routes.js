// copied from react-map-gl/example/examples/route.react.js

'use strict';

var assign = require('object-assign');
var React = require('react');
var d3 = require('d3');
var r = require('r-dom');
var alphaify = require('alphaify');

var MapGL = require('react-map-gl');
var SVGOverlay = require('./node_modules/react-map-gl/src/overlays/svg.react');
var CanvasOverlay = require('./node_modules/react-map-gl/src/overlays/canvas.react');

var ROUTES = require('./data/routes-example.json');
var RUNS = [];
var SPARKS = [];

var color = d3.scale.category10();

var RouteOverlayExample = React.createClass({
    displayName: 'RouteOverlayExample',

    propTypes: {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },

    getInitialState: function getInitialState() {

        ["./data/run1.gpx", "./data/run2.gpx"].forEach(this._getRun);

        return {
            viewport: {
                latitude: 37.78,
                longitude: -122.45,
                zoom: 12,
                startDragLngLat: null,
                isDragging: false
            }
        };
    },

    _onChangeViewport: function _onChangeViewport(viewport) {
        if (this.props.onChangeViewport) {
            return this.props.onChangeViewport(viewport);
        }
        this.setState({viewport: viewport});
    },

    _renderRoute: function _renderRoute(points, index) {
        return r.g({style: {pointerEvents: 'click', cursor: 'pointer'}}, [
            r.g({
                style: {pointerEvents: 'visibleStroke'},
                onClick: function onClick() {
                    console.debug('route ' + index);
                }
            }, [
                r.path({
                    d: 'M' + points.join('L'),
                    style: {
                        fill: 'none',
                        stroke: alphaify(color(index), 0.7),
                        strokeWidth: 6
                    }
                })
            ])
        ]);
    },

    _redrawSVGOverlay: function _redrawSVGOverlay(opt) {
        if (!RUNS) {
            return;
        }
        var routes = RUNS.map(function _map(route, index) {
            var points = route.coordinates.map(opt.project).map(function __map(p) {
                return [d3.round(p[0], 1), d3.round(p[1], 1)];
            });
            return r.g({key: index}, this._renderRoute(points, index));
        }, this);
        return r.g(routes);
    },

    _redrawCanvasOverlay: function _redrawCanvasOverlay(opt) {
        if (!RUNS) {
            return;
        }
        var ctx = opt.ctx;
        var width = opt.width;
        var height = opt.height;
        ctx.clearRect(0, 0, width, height);
        RUNS.map(function _map(route, index) {
            route.coordinates.map(opt.project).forEach(function _forEach(p, i) {
                var point = [d3.round(p[0], 1), d3.round(p[1], 1)];
                ctx.fillStyle = d3.rgb(color(index)).brighter(1).toString();
                ctx.beginPath();
                ctx.arc(point[0], point[1], 2, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    },

    _getRun: function (fileName) {
        d3.xml(fileName, function (error, data) {

            var nodes = data.querySelectorAll("trkpt");
            var filteredNodes = [].filter.call(nodes,
                function (point, i) { return i % 500 === 0; }); // TODO - remove

            var points = [].map.call(filteredNodes, function(node) {
                var point = {
                    coordinates: [ +node.getAttribute("lon"), +node.getAttribute("lat") ]
                };
                [].forEach.call(node.querySelector("extensions").getElementsByTagName("*"), function (n) {
                    console.debug("prefix = " + n.prefix + ", name = " + n.nodeName + ", value = " + n.textContent);
                });
                return point;
            });

            var coordinates = points.map(function (point) {
                return point.coordinates;
            });
            var run = { coordinates: coordinates };
            RUNS.push(run);

            this.forceUpdate();
        }.bind(this));
    },

    render: function render() {

        var viewport = assign({}, this.state.viewport, this.props);
        return r(MapGL, assign({}, viewport, {
            onChangeViewport: this._onChangeViewport
        }), [
            r(SVGOverlay, assign({redraw: this._redrawSVGOverlay}, viewport)),
            r(CanvasOverlay, assign({redraw: this._redrawCanvasOverlay}, viewport))
        ]);
    }
});

module.exports = RouteOverlayExample;