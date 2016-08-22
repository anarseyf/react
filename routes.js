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

var color = d3.scale.category10();

var RouteOverlayExample = React.createClass({
    displayName: 'RouteOverlayExample',

    propTypes: {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired
    },

    getInitialState: function getInitialState() {

        return {
            viewport: {
                latitude: 37.79,
                longitude: -122.45,
                zoom: 11.0,
                startDragLngLat: null,
                isDragging: false
            },
            runs: this.props.runs,
            selectedRunIndex: this.props.selectedRunIndex
        }
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
                    // console.debug('route ' + index);
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

    _getRouteCoordinates: function (route) {
        return route.map(function (datum) {
            return datum.coordinates;
        });
    },

    _redrawSVGOverlay: function _redrawSVGOverlay(opt) {
        var runs = [this.state.runs[this.props.selectedRunIndex]];
        var routes = runs.map(function _map(run, index) {
            var route = run.route;
            var coordinates = this._getRouteCoordinates(route);
            var points = coordinates.map(opt.project).map(function __map(p) {
                return [d3.round(p[0], 1), d3.round(p[1], 1)];
            });
            return r.g({key: index}, this._renderRoute(points, index));
        }, this);
        return r.g(routes);
    },

    _redrawCanvasOverlay: function _redrawCanvasOverlay(opt) {

        var runs = [this.state.runs[this.props.selectedRunIndex]];
        var ctx = opt.ctx;
        var width = opt.width;
        var height = opt.height;
        ctx.clearRect(0, 0, width, height);

        runs.map(function _map(run, index) {
            var route = run.route;
            var coordinates = this._getRouteCoordinates(route);
            coordinates.map(opt.project).forEach(function _forEach(p, i) {
                var point = [d3.round(p[0], 1), d3.round(p[1], 1)];
                ctx.fillStyle = d3.rgb(color(index)).brighter(1).toString();
                ctx.beginPath();
                ctx.arc(point[0], point[1], 2, 0, Math.PI * 2);
                ctx.fill();
            });
        }, this);
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