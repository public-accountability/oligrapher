import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import NodeLabel from './NodeLabel';
import NodeCircle from './NodeCircle';
import ds from '../NodeDisplaySettings';
import { DraggableCore } from 'react-draggable';
import Graph from '../models/Graph';
import { merge } from 'lodash';

export default class Node extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop');
    this.state = props.node.display;
  }

  render() {
    const n = this.props.node;
    const { x, y } = this.state;
    const groupId = `node-${n.id}`;
    const transform = `translate(${x}, ${y})`;

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <g id={groupId} className="node" transform={transform}>
          <NodeCircle node={n} />
          <NodeLabel node={n} />
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    this.setState(props.node.display);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return JSON.stringify(nextState) !== JSON.stringify(this.state);
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
    let n = this.props.node;
    let x = (ui.position.clientX - this._startDrag.clientX) + this._startPosition.x;
    let y = (ui.position.clientY - this._startDrag.clientY) + this._startPosition.y;

    this.setState({ x, y });

    // update state of connecting edges
    let edges = Graph.edgesConnectedToNode(this.props.graph, n.id);

    edges.forEach((edge) => {
      let thisNodeNum = edge.node1_id == n.id ? 1 : 2;
      let otherNode = this.props.graph.nodes[thisNodeNum == 1 ? edge.node2_id : edge.node1_id];
      let x1, y1, x2, y2;

      let newState = (thisNodeNum == 1) ? { x1: x, y1: y } : { x2: x, y2: y };
      this.graphInstance.edges[edge.id].setState(newState);
    });
  }

  // store updated once dragging is done
  _handleDragStop(e, ui) {
    this.props.moveNode(this.props.graph.id, this.props.node.id, this.state.x, this.state.y);
  }
}