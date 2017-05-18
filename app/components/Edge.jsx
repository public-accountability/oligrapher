import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';
import { DraggableCore } from 'react-draggable';
import merge from 'lodash/merge';
import includes from 'lodash/includes';
import eds from '../EdgeDisplaySettings';
import nds from '../NodeDisplaySettings';
import classNames from 'classnames';
import { calculateDeltas } from  '../helpers';

const noUpdateValues = [false, 0, null, "left", "right", "both"];

export default class Edge extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag', '_handleDragStop', '_handleClick', '_handleTextClick');
    // need control point immediately for dragging
    let { cx, cy, is_reverse } = this._calculateGeometry(props.edge.display);
    this.state = merge({}, props.edge.display, { cx, cy });
  }
  
  render() {
    let e = this.props.edge;
    let sp = this._getSvgParams(e);
    let width = 1 + (e.display.scale - 1) * 5;
    let selected = this.props.selected;
    let highlighted = e.display.status == "highlighted";

    return (
      <DraggableCore
        ref={(c) => this.draggable = c}
        handle=".handle"
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}
        onStop={this._handleDragStop}>
        <g id={sp.groupId} className={classNames({ edge: true, selected, highlighted })}>
          { selected ? <path 
            className="edge-selection" 
            d={sp.curve} 
            stroke={eds.selectColor} 
            strokeOpacity={eds.selectOpacity} 
            strokeWidth={width + eds.selectWidthDiff} 
            fill="none"></path> : null }
          { highlighted ? <path 
            className="edge-background" 
            d={sp.curve} 
            stroke={sp.bgColor} 
            strokeOpacity={sp.Opacity} 
            strokeWidth={width + eds.bgWidthDiff} 
            fill="none"></path> : null }
          <path 
            id={sp.pathId} 
            className="edge-line" 
            d={sp.curve} 
            stroke={sp.lineColor} 
            strokeDasharray={sp.dash} 
            strokeWidth={width} 
            fill="none" 
            markerStart={sp.markerStart} 
            markerEnd={sp.markerEnd}></path>
          <path 
            className="handle edge-handle edgeSelect" 
            d={sp.curve} 
            stroke="#fff" 
            strokeOpacity="0"
            strokeWidth={width + 20} 
            fill="none"
            onClick={this._handleClick}></path>
          { this.state.label ? <text 
            className={classNames({ link: e.display.url, handle: true })}
            dy={-5 - width/2} 
            fill={sp.textColor} 
            textAnchor="middle" 
            onClick={this._handleTextClick}
            dangerouslySetInnerHTML={sp.textPath}></text> : null }
        </g>
      </DraggableCore>
    );
  }

  componentWillReceiveProps(props) {
    let newState = merge({ label: null, url: null }, props.edge.display);
    this.setState(newState);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.selected !== this.props.selected || 
           JSON.stringify(nextState) !== JSON.stringify(this.state);
  }

  _handleDragStart(event, data) {
    event.preventDefault();
    this._startDrag = data;
    this._startPosition = {
      x: this.state.cx,
      y: this.state.cy
    }
  }

  _handleDrag(event, data) {
    if (this.props.isLocked) return;
    this._dragging = true; // so that _handleClick knows it's not just a click

    let { x, y } = calculateDeltas(data, this._startPosition, this._startDrag, this.graph.state.actualZoom);
    let [ cx, cy ] = [ x, y ];
    this.setState({ cx, cy });
  }

  _handleDragStop(e, data) {
    // event fires every mouseup so we check for actual drag before updating store
    if (this._dragging) {
      this.props.moveEdge(this.props.edge.id, this.state.cx, this.state.cy);
    }
  }

  _handleClick() {
    if (this._dragging) {
      this._dragging = false;
    } else if (this.props.clickEdge) {
      this.props.clickEdge(this.props.edge.id);
    }
  }

  _handleTextClick() {
    if (this.props.edge.display.url) {
      let tab = window.open(this.props.edge.display.url, '_blank');
      tab.focus();
    }
  }

  _getSvgParams(edge) {
    let e = edge;
    let { label, scale, arrow, dash, status } = this.state;
    let { x, y, cx, cy, xa, ya, xb, yb, is_reverse } = this._calculateGeometry(this.state);
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
      markerStart: this._markerStartArrow(arrow, is_reverse),
      markerEnd: this._markerEndArrow(arrow, is_reverse),
      lineColor: eds.lineColor[status],
      textColor: eds.textColor[status],
      bgColor: eds.bgColor[status],
      bgOpacity: eds.bgOpacity[status]
    };
  }

    
    // Arrows indicate directionality.
    // if an arrow is '1->2' it means that the arrows goes from "node1" to "node2"
    // and therefore the marker should be placed at the end of the path.
    // However, if the path is reversed (meaning node 2 is to the left of node 1)
    // then the arrow should be placed at the start.
    // Possible arrow values: '1->2', '2->1', 'both'
    
    // str, boolean -> str
    _markerStartArrow(arrow, is_reverse) {
        if (arrow === "1->2" && is_reverse) {
            return "url(#marker2)";
        } else if (arrow === "2->1" && !is_reverse) {
            return "url(#marker2)";
        } else if (arrow === 'both') {
            return "url(#marker2)";
        } else {
            return "";
        }
    }

    // str, boolean -> str
    _markerEndArrow(arrow, is_reverse) {
        if (arrow === "1->2" && !is_reverse) {
            return "url(#marker1)";
        } else if (arrow === "2->1" && is_reverse) {
            return "url(#marker1)";
        } else if (arrow === 'both') {
            return "url(#marker1)";
        } else {
            return "";
        }
    }

  _calculateGeometry(state) {
    // let edge = this.props.edge;
    let { cx, cy, x1, y1, x2, y2, s1, s2 } = state;
    let r1 = s1 * nds.circleRadius;
    let r2 = s2 * nds.circleRadius;

    // set edge position at midpoint between nodes
    let x = (x1 + x2) / 2;
    let y = (y1 + y2) / 2;

    // keep track of which node is on left and right ("a" is left, "b" is right)
    let xa, ya, xb, yb, is_reverse;

    if (x1 < x2) {
      xa = x1;
      ya = y1;
      xb = x2;
      yb = y2;
      is_reverse = false;
    } else {
      xa = x2;
      ya = y2;
      xb = x1;
      yb = y1;
      is_reverse = true;
    }

    // generate curve offset if it doesn't exist
    if (!cx || !cy) {
      cx = -(ya - y) * eds.curveStrength;
      cy = (xa - x) * eds.curveStrength;
    }

    // calculate absolute position of curve midpoint
    let mx = cx + x;
    let my = cy + y;

    // curves should not reach the centers of nodes but rather stop at their edges, so we:

    // calculate spacing between curve endpoint and node center
    let sa = is_reverse ? s2 : s1;
    let sb = is_reverse ? s1 : s2;
    let ra = (is_reverse ? r2 : r1) + (sa * nds.circleSpacing);
    let rb = (is_reverse ? r1 : r2) + (sb * nds.circleSpacing);

    // calculate angle from curve midpoint to node center
    let angleA = Math.atan2(ya - my, xa - mx);
    let angleB = Math.atan2(yb - my, xb - mx);

    // x and y offsets for curve endpoints are the above spacing times the cos and sin of the angle
    let xma = ra * Math.cos(angleA);
    let yma = ra * Math.sin(angleA);
    let xmb = rb * Math.cos(angleB);
    let ymb = rb * Math.sin(angleB);

    // finally update edge with new curve endpoints
    xa = xa - xma;
    ya = ya - yma;
    xb = xb - xmb;
    yb = yb - ymb;

    return { x, y, cx, cy, xa, ya, xb, yb, is_reverse };
  }
}
