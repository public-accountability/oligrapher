import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import ds from '../NodeDisplaySettings';

export default class NodeCircle extends BaseComponent {
  render() {
    return (
      <g className="nodeCircle">
        { this.props.selected ? this._selectionCirlce() : null }
        {this._bgCircle()}
        {this._circle()}
      </g>
    );
  }

  componentDidMount() {
    let element = ReactDOM.findDOMNode(this);
    let images = element.querySelectorAll("image");

    for (var i = 0; i < images.length; ++i) {
      images[i].ondragstart = (e) => { e.preventDefault(); return false; };
    }
  }

  _selectionCirlce() {
    const { scale } = this.props.node.display;
    const r = ds.circleRadius * scale;
    const bgColor = ds.selectColor;
    const bgOpacity = 0.5;
    const bgRadius = r + (ds.selectionRadiusDiff * scale);
    return <circle className="node-selection" r={bgRadius} fill={bgColor} opacity={bgOpacity}></circle>;
  }

  _bgCircle() {
    const { scale, status } = this.props.node.display;
    const r = ds.circleRadius * scale;
    const bgColor = ds.bgColor[status];
    const bgOpacity = ds.bgOpacity[status];
    const bgRadius = r + (ds.bgRadiusDiff * scale);
    return <circle className="node-background" r={bgRadius} fill={bgColor} opacity={bgOpacity}></circle>;
  }

  _circle() {
    const n = this.props.node;
    const { scale, status, color, image } = n.display;
    const r = ds.circleRadius * scale;
    const clipId = `image-clip-${n.id}`;
    const clipPath = `url(#${clipId})`;
    const imageWidth = r * ds.imageScale;
    const imageOpacity = ds.imageOpacity[status];
    const innerHTML = { __html:
      `<clipPath id="${clipId}">
         <circle r="${r}" opacity="1"></circle>
       </clipPath>
       <image
         class="handle"
         draggable="false"
         x="${-imageWidth/2}"
         y="${-imageWidth/2}"
         xlink:href="${image}"
         height="${imageWidth}"
         width="${imageWidth}"
         opacity="${imageOpacity}"
         clip-path="${clipPath}">
       </image>`
    };

    return image ? 
      <g dangerouslySetInnerHTML={innerHTML} /> : 
      <circle 
        className="handle" 
        r={r}
        fill={color ? color : ds.circleColor[status]}
        opacity={ds.circleOpacity[status]}>
      </circle>;
  }
}