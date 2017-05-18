import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import Node from './Node';
import Edge from './Edge';
import Caption from './Caption';
import GraphModel from '../models/Graph';
import { DraggableCore } from 'react-draggable';
import values from 'lodash/values';
import min from 'lodash/min';
import max from 'lodash/max';
import includes from 'lodash/includes';
import { calculateDeltas } from '../helpers';

export default class Graph extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop');
    this.nodes = {};
    this.edges = {};
    this.mounted = false;
    let viewBox = this._computeViewbox(props.graph, props.zoom, props.viewOnlyHighlighted);
    let height = props.isEmbedded ? props.embedded.graphHeight : props.height;
    this.state = { x: 0, y: 0, viewBox, height };
  }

  render() {
    let { x, y, prevGraph, viewBox, height } = this.state;

    return (
      <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" className="Graph" width="100%" height={height} viewBox={viewBox} preserveAspectRatio="xMidYMid">
        <DraggableCore
          handle="#zoom-handle"
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
    this.mounted = true;
    this._updateActualZoom(this.state.viewBox);
  }

  componentWillReceiveProps(nextProps) {
    this._updateViewbox(nextProps.graph, nextProps.zoom, nextProps.viewOnlyHighlighted);
  }

  // RENDERING

  _renderEdges() {
    return values(this.props.graph.edges).map((e, i) =>  
      <Edge 
        ref={(c) => { this.edges[e.id] = c; if (c) { c.graph = this; } }} 
        key={e.id} 
        edge={e} 
        graphId={this.props.graph.id} 
        zoom={this.props.zoom}
        selected={this.props.selection && includes(this.props.selection.edgeIds, e.id)}
        clickEdge={this.props.clickEdge}
        moveEdge={this.props.moveEdge} 
        isLocked={this.props.isLocked}
        updateArrow={() => this._updateArrowState(e)} />);
  }

  _getArrowDirection(is_reverse, edge){
      if (!is_reverse){
        edge.display.arrow = "left";
      } else {
        edge.display.arrow = "right";
      }
  }

  _updateArrowState(edge){
    this.props.graphApi.updateEdge(edge.id, { display: edge.display });
  }

  _renderNodes() {
    return values(this.props.graph.nodes).map((n, i) => 
      <Node 
        ref={(c) => { this.nodes[n.id] = c; if (c) { c.graph = this; } }} 
        key={n.id} 
        node={n} 
        graph={this.props.graph} 
        zoom={this.props.zoom} 
        selected={this.props.selection && includes(this.props.selection.nodeIds, n.id)}
        clickNode={this.props.clickNode} 
        moveNode={this.props.moveNode} 
        isLocked={this.props.isLocked} />);
  }

  _renderCaptions() {
    return values(this.props.graph.captions).map((c, i) => 
      <Caption 
        ref={(c) => { if (c) { c.graph = this; } }}
        key={c.id} 
        caption={c}
        graphId={this.props.graph.id}
        selected={this.props.selection && includes(this.props.selection.captionIds, c.id)}
        moveCaption={this.props.moveCaption} 
        clickCaption={this.props.clickCaption} 
        isLocked={this.props.isLocked} />);
  }

  _renderMarkers() {
    return `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" fill="#999"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5" fill="#999"></path></marker><marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>`;
  }

  // VIEWBOX AND ZOOM

  _updateViewbox(graph, zoom, viewOnlyHighlighted) {
    let viewBox = this._computeViewbox(graph, zoom, viewOnlyHighlighted);
    let changed = (viewBox !== this.state.viewBox);
    let oldViewBox = changed ? this.state.viewBox : null;
    this.setState({ viewBox, oldViewBox });
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

  _computeViewbox(graph, zoom = 1.2, viewOnlyHighlighted = true) {
    let rect = this._computeRect(graph, viewOnlyHighlighted);
    let w = rect.w / zoom;
    let h = rect.h / zoom;
    let x = rect.x + rect.w/2 - (w/2);
    let y = rect.y + rect.h/2 - (h/2);

    return `${x} ${y} ${w} ${h}`;
  }

  _computeRect(graph, onlyHighlighted = true) {
    let nodes = values(graph.nodes)
      .filter(n => !onlyHighlighted || n.display.status === "highlighted")
      .map(n => n.display);
    let captions = values(graph.captions)
      .filter(c => !onlyHighlighted || c.display.status === "highlighted")
      .map(c => c.display);
    let items = nodes.concat(captions);

    // show all nodes and captions if none are highlighted
    if (items.length == 0) {
      nodes = values(graph.nodes).map(n => n.display);
      captions = values(graph.captions).map(c => c.display);
      items = nodes.concat(captions);
    }

    if (items.length > 0) {
      const padding = onlyHighlighted ? 100 : 100;
      const xs = items.map(i => i.x);
      const ys = items.map(i => i.y);
      const textPadding = 100; // node text might extend below node
      let x = min(xs) - padding;
      let y = min(ys) - padding;
      let w = max(xs) - min(xs) + padding * 2;
      let h = max(ys) - min(ys) + textPadding + padding;
      let factor = Math.min(400/w, 400/h);

      if (factor > 1) {
        x = x - (w * (factor - 1) / 2);
        y = y - (h * (factor - 1) / 2);
        w = w * factor;
        h = h * factor;
      }

      return { x, y, w, h };
    } else {
      return { x: -200, y: -200, w: 400, h: 400 };
    }
  }

  // GRAPH DRAGGING

  _handleDragStart(e, data) {
    this._startDrag = data;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  _handleDrag(e, data) {
    this._dragging = true;
    let { x, y } = calculateDeltas(data, this._startPosition, this._startDrag, this.state.actualZoom);
    // in order to avoid rerendering state isn't updated until drag is finished
    ReactDOM.findDOMNode(this).querySelector("#zoom").setAttribute("transform", `translate(${x}, ${y})`);
  }

  _handleDragStop(e, data) {
    // event fires every mouseup so we check for actual drag before updating state
    if (this._dragging) {
      let { x, y } = calculateDeltas(data, this._startPosition, this._startDrag, this.state.actualZoom);
      this.setState({ x, y });
      this._dragging = false;
    }
  }

  // _calculateDeltas(e, ui) {
  //   let deltaX = (data.x - this._startDrag.x) / this.graph.state.actualZoom;
  //   let deltaY = (data.y - this._startDrag.y) / this.graph.state.actualZoom;
  //   // let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.state.actualZoom;
  //   // let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.state.actualZoom;
    
  //   let x = deltaX + this._startPosition.x;
  //   let y = deltaY + this._startPosition.y;
  //   return { x, y };
  // }

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

  recenter() {
    this.setState({ x: 0, y: 0 });
  }
}
