import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import Node from './Node';
import Edge from './Edge';
import Caption from './Caption';
import GraphModel from '../models/Graph';
import { DraggableCore } from 'react-draggable';
import { values, min, max, includes }  from 'lodash';

export default class Graph extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop');
    this.nodes = {};
    this.edges = {};
    this.mounted = false;
    let viewBox = this._computeViewbox(props.graph, props.zoom);
    this.state = { x: 0, y: 0, viewBox };
  }

  render() {
    const { x, y, prevGraph, viewBox } = this.state;

    return (
      <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" className="Graph" width="100%" height={this.props.height} viewBox={viewBox} preserveAspectRatio="xMidYMid">
        <DraggableCore
          handle="#zoom-handle"
          moveOnStartChange={false}
          onStart={this._handleDragStart}
          onDrag={this._handleDrag}
          onStop={this._handleDragStop}>
          <g id="zoom" transform={`translate(${x}, ${y})`}>
            <rect id="zoom-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
            { this._renderEdges() }
            { this._renderNodes() }
            { this._renderCaptions() }
          </g>
        </DraggableCore>
        <defs dangerouslySetInnerHTML={ { __html: this._renderMarkers() } }/>
      </svg>
    );
  }

  // COMPONENT LIFECYCLE
  
  componentDidMount() {
    ReactDOM.findDOMNode(this).setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this.mounted = true;
    this._updateActualZoom(this.state.viewBox);
  }

  componentWillReceiveProps(nextProps) {
    this._updateViewbox(nextProps.graph, nextProps.zoom);
  }

  // RENDERING

  _renderEdges() {
    return values(this.props.graph.edges).map((e, i) =>  
      <Edge 
        ref={(c) => { this.edges[e.id] = c; if (c) { c.graph = this; } }} 
        key={i} 
        edge={e} 
        graphId={this.props.graph.id} 
        zoom={this.props.zoom}
        altKey={this.props.altKey}
        selected={this.props.selection && includes(this.props.selection.edgeIds, e.id)}
        highlightEdge={this.props.highlightEdge}
        moveEdge={this.props.moveEdge} 
        selectEdge={this.props.selectEdge} />);
  }

  _renderNodes() {
    return values(this.props.graph.nodes).map((n, i) => 
      <Node 
        ref={(c) => { this.nodes[n.id] = c; if (c) { c.graph = this; } }} 
        key={i} 
        node={n} 
        graph={this.props.graph} 
        zoom={this.props.zoom} 
        altKey={this.props.altKey}
        selected={this.props.selection && includes(this.props.selection.nodeIds, n.id)}
        highlightNode={this.props.highlightNode} 
        moveNode={this.props.moveNode} 
        selectNode={this.props.selectNode} />);
  }

  _renderCaptions() {
    return values(this.props.graph.captions).map((c, i) => 
      <Caption 
        ref={(c) => { if (c) { c.graph = this; } }}
        key={i} 
        caption={c}
        graphId={this.props.graph.id}
        altKey={this.props.altKey}
        selected={this.props.selection && includes(this.props.selection.captionIds, c.id)}
        moveCaption={this.props.moveCaption} 
        selectCaption={this.props.selectCaption} />);
  }

  _renderMarkers() {
    return `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" fill="#999"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5" fill="#999"></path></marker><marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>`;
  }

  // VIEWBOX AND ZOOM

  _updateViewbox(graph, zoom) {
    let viewBox = this._computeViewbox(graph, zoom);
    let changed = (viewBox !== this.state.viewBox);
    let oldViewBox = changed ? this.state.viewBox : null;
    this.setState({ viewBox: viewBox, oldViewBox });
    this._updateActualZoom(viewBox);

    if (changed && GraphModel.hasContent(graph)) {
      this._animateTransition(oldViewBox, viewBox);
    }
  }

  _updateActualZoom(viewBox) {
    if (this.mounted) {
      let [x, y, w, h] = viewBox.split(" ").map(i => parseInt(i));
      let domNode = ReactDOM.findDOMNode(this);
      let svgWidth = domNode.getBoundingClientRect().width;
      let svgHeight = domNode.getBoundingClientRect().height;
      let xFactor = svgWidth / w;
      let yFactor = svgHeight / h;
      let actualZoom = Math.min(xFactor, yFactor);
      this.setState({ actualZoom });
    }
  }

  _computeViewbox(graph, zoom = 1.2) {
    let highlightedOnly = true;
    let rect = this._computeRect(graph, highlightedOnly);
    let w = rect.w / zoom;
    let h = rect.h / zoom;
    let x = rect.x + rect.w/2 - (w/2);
    let y = rect.y + rect.h/2 - (h/2);

    return `${x} ${y} ${w} ${h}`;
  }

  _computeRect(graph, highlightedOnly = true) {
    const nodes = values(graph.nodes)
      .filter(n => !highlightedOnly || n.display.status != "faded")
      .map(n => n.display);
    const items = nodes.concat(...values(graph.captions).map(c => c.display));

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

  // GRAPH DRAGGING

  _handleDragStart(e, ui) {
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  _handleDrag(e, ui) {
    this._dragging = true;
    let { x, y } = this._calculateDeltas(e, ui);
    // in order to avoid rerendering state isn't updated until drag is finished
    ReactDOM.findDOMNode(this).querySelector("#zoom").setAttribute("transform", `translate(${x}, ${y})`);
  }

  _handleDragStop(e, ui) {
    // event fires every mouseup so we check for actual drag before updating state
    if (this._dragging) {
      let { x, y } = this._calculateDeltas(e, ui);
      this.setState({ x, y });
      this._dragging = false;
    }
  }

  _calculateDeltas(e, ui) {
    let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.state.actualZoom;
    let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.state.actualZoom;
    let x = deltaX + this._startPosition.x;
    let y = deltaY + this._startPosition.y;
    return { x, y };
  }

  // TRANSITION ANIMATION

  _animateTransition(oldViewBox, viewBox, duration) {
    if (!this._isSmallDevice() && viewBox && oldViewBox && viewBox !== oldViewBox) {

      let start = this._now();
      let that = this;
      let domNode = ReactDOM.findDOMNode(that);
      let req;

      let oldVb = oldViewBox.split(" ").map(n => parseInt(n));
      let newVb = viewBox.split(" ").map(n => parseInt(n));

      // if duration not supplied, calculate based on change of size and center
      if (!duration) {
        let wRatio = newVb[2]/oldVb[2];
        let hRatio = newVb[3]/oldVb[3];
        let oldCenterX = oldVb[0] + oldVb[2]/2;
        let oldCenterY = oldVb[1] + oldVb[3]/2;
        let newCenterX = newVb[0] + newVb[2]/2;
        let newCenterY = newVb[1] + newVb[3]/2;
        let ratio = Math.max(wRatio, 1/wRatio, hRatio, 1/hRatio);
        let dist = Math.floor(Math.sqrt(Math.pow(newCenterX - oldCenterX, 2) + Math.pow(newCenterY - oldCenterY, 2)));
        duration = 1 - 1/(ratio + Math.log(dist + 1));
        duration = Math.max(0.4, duration);
      }
    
      const draw = () => {
        req = requestAnimationFrame(draw);

        let time = (that._now() - start);
        let vb = oldVb.map((part, i) => { 
          return oldVb[i] + (newVb[i] - oldVb[i]) * that._linear(time / duration);
        }).join(" ");

        domNode.setAttribute("viewBox", vb);

        if (time > duration) {
          cancelAnimationFrame(req);
        }
      };

      requestAnimationFrame(draw);

    } else {
      ReactDOM.findDOMNode(this).setAttribute("viewBox", viewBox);
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

  _isSmallDevice() {
    return window.innerWidth < 600;
  }
}