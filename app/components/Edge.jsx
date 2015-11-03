import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';
import { merge } from 'lodash';
const ds = require('../EdgeDisplaySettings');

export default class Edge extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleTextClick');
    this.state = this.props.edge.display;
  }

  render() {
    let e = this.props.edge;
    let sp = this._getSvgParams(e);
    let scale  = e.display.scale;

    return (
      <DraggableCore
        ref={(c) => this.draggable = c}
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onDragStop={this._handleDragStop}>
        <g id={sp.groupId} className="edge">
          <path 
            className="edge-background" 
            d={sp.curve} 
            stroke={sp.bgColor} 
            strokeOpacity={sp.bgOpacity} 
            strokeWidth={scale + 5} 
            fill="none"></path>
          <path 
            id={sp.pathId} 
            className="edge-line" 
            d={sp.curve} 
            stroke={sp.lineColor} 
            strokeDasharray={sp.dash} 
            strokeWidth={scale} 
            fill="none" 
            markerStart={sp.markerStart} 
            markerEnd={sp.markerEnd}></path>
          <text 
            className={e.display.url ? "link" : null}
            dy={sp.dy} 
            fill={sp.textColor} 
            textAnchor="middle" 
            onClick={this._handleTextClick}
            dangerouslySetInnerHTML={sp.textPath}></text>
          <path 
            className="handle edge-handle" 
            d={sp.curve} 
            stroke="#fff" 
            strokeOpacity="0"
            strokeWidth={scale + 20} 
            fill="none"></path>
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    this.setState(props.edge.display);
  }

  _handleDragStart(event, ui) {
    this._startDrag = ui.position;
    this._startPosition = {
      x: this.props.edge.display.x,
      y: this.props.edge.display.y
    }
  };

  _handleDrag(event, ui) {
    let e = this.props.edge;
    let x = (ui.position.clientX - this._startDrag.clientX) + this._startPosition.x;
    let y = (ui.position.clientY - this._startDrag.clientY) + this._startPosition.y;

    this.setState(merge({}, e.display, { x, y }));
  }

  _handleDragStop(e, ui) {
    this.props.moveEdge(this.props.graph.id, this.props.edge.id, this.state.x, this.state.y);
  }

  _handleTextClick() {
    if (this.props.edge.display.url) {
      let tab = window.open(this.props.edge.display.url, '_blank');
      tab.focus();
    }
  }

  _getSvgParams(edge) {
    let e = edge;

    let { label, scale, arrow, is_reverse, dash, status } = e.display;
    let { x, y, xa, ya, xb, yb, cx, cy } = this.state;

    const pathId = `path-${e.id}`;
    const fontSize = 10 * Math.sqrt(scale);

    return {
      curve: `M ${xa}, ${ya} Q ${x + cx}, ${y + cy}, ${xb}, ${yb}`,
      groupId: `edge-${e.id}`,
      pathId: pathId,
      dash: dash ? dash : "",
      fontSize: fontSize,
      dy: -6 * Math.sqrt(scale),
      textPath: { __html: `<textPath class="labelpath" startOffset="50%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${pathId}" font-size="${fontSize}">${label}</textPath>` },
      markerStart: (arrow && is_reverse) ? "url(#marker2)" : "",
      markerEnd: (arrow && !is_reverse) ? "url(#marker1)" : "",
      lineColor: ds.lineColor[status],
      textColor: ds.textColor[status],
      bgColor: ds.bgColor[status],
      bgOpacity: ds.bgOpacity[status]
    };
  }
}