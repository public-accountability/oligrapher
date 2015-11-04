import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';

export default class Caption extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop');
    this.state = props.caption.display;
  }

  render() {
    let { x, y, text } = this.state;

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <text className="caption handle" x={x} y={y}>{text}</text>
      </DraggableCore>
    );
  }

  _handleDragStart(e, ui) {
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  _handleDrag(e, ui) {
    let c = this.props.caption;
    let x = (ui.position.clientX - this._startDrag.clientX) + this._startPosition.x;
    let y = (ui.position.clientY - this._startDrag.clientY) + this._startPosition.y;

    this.setState({ x, y });
  }

  _handleDragStop(e, ui) {
    this.props.moveCaption(this.props.graphId, this.props.caption.id, this.state.x, this.state.y);
  }
}