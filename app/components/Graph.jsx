import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Node from './Node';
import Edge from './Edge';
import Draggable from 'react-draggable';
import { values, min, max }  from 'lodash';

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.nodes = {};
    this.edges = {};
  }

  render() {
    let sp = this._getSvgParams(this.props.graph);
    let viewBox = this.props.prevGraph ? this._computeViewbox(this.props.prevGraph, this.props.zoom) : sp.viewBox;

    return (
      <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" className="Graph" width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMin">       
        <Draggable
          handle="#zoom-handle"
          moveOnStartChange={false}
          zIndex={100} >
          <g id="zoom">
            <rect id="zoom-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
            { sp.edges }
            { sp.nodes }
            { sp.captions }
          </g>
        </Draggable>
        <defs dangerouslySetInnerHTML={ { __html: sp.markers } }/>
      </svg>
    );
  }
  
  componentDidMount() {
    document.getElementById("svg").setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this._animateTransition();
  }

  componentDidUpdate() {
    this._animateTransition();    
  }

  _animateTransition(duration = 0.7) {
    if (!this._isSmallDevice() && this.props.prevGraph) {
      this.props.resetZoom();
      let oldViewbox = this._computeViewbox(this.props.prevGraph, this.props.zoom).split(" ").map(function(part) { return parseInt(part); });
      let newViewbox = this._computeViewbox(this.props.graph, this.props.zoom).split(" ").map(function(part) { return parseInt(part); });
      let start = this._now();
      let that = this;

      let req;

      const draw = function() {
        req = requestAnimationFrame(draw);

        let time = (that._now() - start);
        let fraction = time / duration;
        let viewbox = oldViewbox.map(function(part, i) {
          return oldViewbox[i] + (newViewbox[i] - oldViewbox[i]) * that._linear(fraction);
        }).join(" ");

        ReactDOM.findDOMNode(that).setAttribute("viewBox", viewbox);

        if (time > duration) {
          cancelAnimationFrame(req);
        }
      };

      requestAnimationFrame(draw);

    } else {
      ReactDOM.findDOMNode(this).setAttribute("viewBox", this._computeViewbox(this.props.graph, this.props.zoom));
    }
  }

  _linear(t) {
    return t;
  }

  _easeInOutQuad(t) { 
    return (t < .5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t);
  }

  _now() {
    return new Date().getTime() / 1000;
  }

  _getSvgParams(graph) {
    let that = this;
    return {
      edges: values(graph.edges).map((e, i) =>  
        <Edge 
          ref={(c) => { this.edges[e.id] = c; if (c) { c.graphInstance = this; } }} 
          key={i} 
          edge={e} 
          graphId={this.props.graph.id} 
          zoom={this.props.zoom} 
          moveEdge={this.props.moveEdge} />
      ),
      nodes:  values(graph.nodes).map((n, i) => 
        <Node 
          ref={(c) => { this.nodes[n.id] = c; if (c) { c.graphInstance = this; } }} 
          key={i} 
          node={n} 
          graph={this.props.graph} 
          zoom={this.props.zoom} 
          clickNode={that.props.clickNode} 
          moveNode={that.props.moveNode} />
      ),
      markers: `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" fill="#999"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5" fill="#999"></path></marker><marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>`,
      viewBox: this._computeViewbox(graph, this.props.zoom),
      captions: values(graph.captions).map((c, index) => <text key={index} x={c.display.x} y={c.display.y}>{c.display.text}</text>)
    };
  }

  _computeViewbox(graph, zoom = 1.2) {
    let highlightedOnly = true;
    let rect = this._computeRect(graph, highlightedOnly);
    let w = Math.max(rect.w / zoom, 600 / zoom);
    let h = Math.max(rect.h / zoom, 400 / zoom);
    let x = rect.x + rect.w/2 - (w/2);
    let y = rect.y + rect.h/2 - (h/2);

    return `${x} ${y} ${w} ${h}`;
  }

  _computeRect(graph, highlightedOnly = true) {
    const nodes = values(graph.nodes)
      .filter(n => !highlightedOnly || n.display.status != "faded")
      .map(n => n.display);
    // const edges = values(graph.edges)
    //   .filter(e => e.display.status != "faded")
    //   .map(e => ({ x: e.display.cx, y: e.display.cy }));
    const items = nodes;

    if (items.length > 0) {
      const padding = highlightedOnly ? 50 : 50;
      const xs = items.map(i => i.x);
      const ys = items.map(i => i.y);
      const textPadding = 100; // node text might extend below node
      return { 
        x: min(xs) - padding, 
        y: min(ys) - padding, 
        w: max(xs) - min(xs) + padding * 2, 
        h: max(ys) - min(ys) + textPadding + padding
      };
    } else {
      return { x: 0, y: 0, w: 0, h: 0 };
    }
  }


  _isSmallDevice() {
    return window.innerWidth < 990;
  }
}