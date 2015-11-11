import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import NodeLabel from './NodeLabel';
import NodeCircle from './NodeCircle';
import ds from '../NodeDisplaySettings';
import { DraggableCore } from 'react-draggable';
import Graph from '../models/Graph';
import { merge } from 'lodash';
import classNames from 'classnames';
import Helpers from '../models/Helpers';

export default class Node extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop', '_handleClick');
    this.state = props.node.display;
  }

  render() {
    const n = this.props.node;
    const { x, y, name } = this.state;
    const groupId = `node-${n.id}`;
    const transform = `translate(${x}, ${y})`;

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <g 
          id={groupId} 
          className="node" 
          transform={transform}
          onClick={this._handleClick}>
          <NodeCircle node={n} selected={this.props.selected} />
          { this.state.name ?  <NodeLabel node={n} /> : null }
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    let newState = merge({ name: null, image: null, url: null }, props.node.display);
    this.setState(newState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected !== this.props.selected || 
           JSON.stringify(nextState) !== JSON.stringify(this.state);
  }

  // keep initial position for comparison with drag position
  _handleDragStart(e, ui) {
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  // node position is updated only in state, not store
  _handleDrag(e, ui) {
    this._dragging = true; // so that _handleClick knows it's not just a click

    let n = this.props.node;
    let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.graph.state.actualZoom;
    let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.graph.state.actualZoom;
    let x = this._startPosition.x + deltaX;
    let y = this._startPosition.y + deltaY;

    this.setState({ x, y });

    // update state of connecting edges
    let edges = Graph.edgesConnectedToNode(this.props.graph, n.id);

    edges.forEach((edge) => {
      let thisNodeNum = edge.node1_id == n.id ? 1 : 2;
      let otherNode = this.props.graph.nodes[thisNodeNum == 1 ? edge.node2_id : edge.node1_id];
      let x1, y1, x2, y2;

      let newState = (thisNodeNum == 1) ? { x1: x, y1: y } : { x2: x, y2: y };
      this.graph.edges[edge.id].setState(newState);
    });
  }

  // store updated once dragging is done
  _handleDragStop(e, ui) {
    // event fires every mouseup so we check for actual drag before updating store
    if (this._dragging) {
      this.props.moveNode(this.props.graph.id, this.props.node.id, this.state.x, this.state.y);
    }
  }

  _handleClick() {
    if (this._dragging) {
      this._dragging = false;
    } else {
      if (this.props.altKey) {
        // multiple select only if shift key is pressed
        if (this.props.selectNode) {
          this.props.selectNode(this.props.node.id);
        }
      } else {
        if (this.props.highlightNode) {
          this.props.highlightNode(this.props.graph.id, this.props.node.id);
        }
      }
    }
  }
}