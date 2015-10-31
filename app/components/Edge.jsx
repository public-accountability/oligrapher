import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';
import { merge } from 'lodash';
const ds = require('../EdgeDisplaySettings');

export default class Edge extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleTextClick');
    this.state = merge({}, this.props.edge.display);
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
        onDrag={this._handleDrag}>      
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
            stroke={sp.bgColor} 
            strokeOpacity={sp.bgOpacity} 
            strokeWidth={scale + 20} 
            fill="none"></path>
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    this.setState(merge({}, props.edge.display));
  }

  _handleDragStart(event, ui) {
    this._startPosition = ui.position;
    this._startControlPoint = this.props.edge.display;
  };

  _handleDrag(event, ui) {
    let cx = (ui.position.lastX - this._startPosition.lastX) + this._startControlPoint.cx;
    let cy = (ui.position.lastY - this._startPosition.lastY) + this._startControlPoint.cy;
    this.props.moveEdge(this.props.graphId, this.props.edge.id, cx, cy);
  }

  _handleTextClick() {
    if (this.props.edge.display.url) {
      let tab = window.open(this.props.edge.display.url, '_blank');
      tab.focus();
    }
  }

  _getSvgParams(edge) {
    let e = edge;

    let { label, scale, is_directional, is_reverse, dash, status } = e.display;
    let { x, y, xa, ya, xb, yb, cx, cy } = this.state;

    const pathId = `path-${e.id}`;
    const fontSize = 10 * Math.sqrt(scale);

    return {
      curve: `M ${xa}, ${ya} Q ${x + cx}, ${y + cy}, ${xb}, ${yb}`,
      groupId: `edge-${e.id}`,
      pathId: pathId,
      dash: dash ? "5, 2" : "",
      fontSize: fontSize,
      dy: -6 * Math.sqrt(scale),
      textPath: { __html: `<textPath class="labelpath" startOffset="50%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${pathId}" font-size="${fontSize}">${label}</textPath>` },
      markerStart: (is_directional && is_reverse) ? "url(#marker2)" : "",
      markerEnd: (is_directional && !is_reverse) ? "url(#marker1)" : "",
      lineColor: ds.lineColor[status],
      textColor: ds.textColor[status],
      bgColor: ds.bgColor[status],
      bgOpacity: ds.bgOpacity[status]
    };
  }
}