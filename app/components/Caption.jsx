import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';
import ds from '../CaptionDisplaySettings';
import merge from 'lodash/object/merge';

export default class Caption extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop', '_handleClick');
    this.state = props.caption.display;
  }

  render() {
    let { x, y, text, scale, status } = this.state;
    let transform = `translate(${x}, ${y})`;
    let highlighted = status == "highlighted";

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <g className="caption" transform={transform} onClick={this._handleClick}>
          { highlighted ? this._highlightRect() : null }
          { this.props.selected ? this._selectionRect() : null }
          <text className="handle" fontSize={scale * 15} opacity={ds.textOpacity[status]}>{text}</text>
        </g>
      </DraggableCore>
    );
  }

  componentDidMount() {
    this._setRectWidths();
  }

  componentDidUpdate(prevProps) {
    let prevDisplay = prevProps.caption.display;
    let display = this.props.caption.display;
    this._setRectWidths();    
  }

  componentWillReceiveProps(props) {
    let newState = merge({ text: null }, props.caption.display);
    this.setState(newState);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected !== this.props.selected || 
           JSON.stringify(nextState) !== JSON.stringify(this.state);
  }

  _setRectWidths() {
    let element = ReactDOM.findDOMNode(this);
    let text = element.querySelector(".handle");
    let highlightRect = this.refs.highlightRect;
    let selectRect = this.refs.selectRect;
    let heightAdj = -6 + this.props.caption.display.scale * 3;
    let textWidth = text.getComputedTextLength();
    let textRect = text.getBoundingClientRect()
    let textHeight = textRect.bottom - textRect.top;

    if (highlightRect) {
      highlightRect.setAttribute("width", textWidth + 10);
      highlightRect.setAttribute("x", -5);   
      highlightRect.setAttribute("height", textHeight + 10);
      highlightRect.setAttribute("y", -textHeight + heightAdj);
    }

    if (selectRect) {
      selectRect.setAttribute("width", textWidth + 10);
      selectRect.setAttribute("x", -5); 
      selectRect.setAttribute("height", textHeight + 10);
      selectRect.setAttribute("y", - textHeight + heightAdj);
    }
  }

  _handleDragStart(e, ui) {
    e.preventDefault();
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.state.x,
      y: this.state.y
    };
  }

  _handleDrag(e, ui) {
    if (this.props.isLocked) return;

    this._dragging = true;

    let deltaX = (ui.position.clientX - this._startDrag.clientX) / this.graph.state.actualZoom;
    let deltaY = (ui.position.clientY - this._startDrag.clientY) / this.graph.state.actualZoom;
    let x = this._startPosition.x + deltaX;
    let y = this._startPosition.y + deltaY;

    this.setState({ x, y });
  }

  _handleDragStop(e, ui) {
    // event fires every mouseup so we check for actual drag before updating store
    if (this._dragging) {
      this.props.moveCaption(this.props.caption.id, this.state.x, this.state.y);
    }
  }

  _handleClick() {
    if (this._dragging) {
      this._dragging = false;
    } else if (this.props.clickCaption) {
      this.props.clickCaption(this.props.caption.id);
    }
  }

  _selectionRect() {
    let width = this.state.text.length * 8;
    let height = ds.lineHeight;

    return (
      <rect
        ref="selectRect"
        fill={ds.selectFillColor}
        opacity={ds.selectOpacity}
        rx={ds.cornerRadius}
        ry={ds.cornerRadius}
        y={-height + 4}
        width={width}
        height={height} />
    );
  }

  _highlightRect() {
    let width = this.state.text.length * 8;
    let height = ds.lineHeight;

    return (
      <rect
        ref="highlightRect"
        fill={ds.highlightFillColor}
        opacity={ds.highlightOpacity}
        rx={ds.cornerRadius}
        ry={ds.cornerRadius}
        y={-height + 4}
        width={width}
        height={height} />
    );
  }
}