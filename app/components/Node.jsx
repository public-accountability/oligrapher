import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import ds from '../NodeDisplaySettings';
import config from '../../config';
import { DraggableCore } from 'react-draggable';

export default class Node extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDrag');
  }

  render() {
    const n = this.props.node;
    const sp = this._getSvgParams(n);

    let { x, y } = n.display;

    return (
      <DraggableCore
        handle=".handle"
        moveOnStartChange={false}
        onStart={this._handleDragStart}
        onDrag={this._handleDrag}>
        <g id={sp.groupId} transform={sp.transform}>
          {sp.bgCircle}
          {sp.circle}
          {sp.rects}
          {sp.tspans}
        </g>
      </DraggableCore>
    );
  }


  _handleDragStart(e, ui) {
    this._startDrag = ui.position;
    this._startPosition = this.props.node.display;
  }

  _handleDrag(e, ui) {
    let x = (ui.position.clientX - this._startDrag.clientX) + this._startPosition.x;
    let y = (ui.position.clientY - this._startDrag.clientY) + this._startPosition.y;
    this.props.moveNode(this.props.graphId, this.props.node.id, x, y);
  };

  _getSvgParams(node) {
    let n = node;
    let { x, y, image, name, scale, url, status } = n.display;
    let r = ds.circleRadius * scale;
    let textOffsetY = ds.textMarginTop + r;
    let textLines = this._textLines(name);
    let linkAttributes = `xlink:href="${url}" target="_blank"`;

    let tspans = url ?
      <g dangerouslySetInnerHTML={ { __html: (`<a class="nodeLabel" ${linkAttributes}><text text-anchor="middle">` + 
          textLines.map((line, i) => {
             let dy = (i == 0 ? textOffsetY : ds.lineHeight);
             return `<tspan class="node-text-line" x="0" dy="${dy}" fill="${ds.textColor[status]}">${line}</tspan>`;
           }) + `</text></a>`)
      } } /> 
      : 
      (<a className="nodeLabel" onClick={this.props.clickNode}><text textAnchor="middle">
        { textLines.map(
           (line, i) => {
             let dy = (i == 0 ? textOffsetY : ds.lineHeight);
             return <tspan className="node-text-line" x="0" dy={dy} fill={ds.textColor[status]}>{line}</tspan>;
           }) }
      </text></a>);

    let rects = textLines.map(
      (line, i) => {
        let width = line.length * 8;
        let height = ds.lineHeight;
        let y = r + 5 + (i * ds.lineHeight);
        return (<rect fill="#fff"
                      opacity="0.8"
                      rx={ds.cornerRadius}
                      ry={ds.cornerRadius}
                      x={-width/2}
                      width={width}
                      height={height}
                      y={y} />);
    });

    let clipId = `image-clip-${n.id}`;
    let clipPath = `url(#${clipId})`;
    let imageWidth = r * ds.imageScale;
    let imageOpacity = ds.imageOpacity[status];
    let innerHTML = { __html:
                      `<clipPath id="${clipId}">
                         <circle r="${r}" opacity="1"></circle>
                       </clipPath>
                       <image
                         class="handle"
                         x="${-imageWidth/2}"
                         y="${-imageWidth/2}"
                         xlink:href="${image}"
                         height="${imageWidth}"
                         width="${imageWidth}"
                         opacity="${imageOpacity}"
                         clip-path="${clipPath}">
                       </image>` };

    const circle =
      image ?
        <g dangerouslySetInnerHTML={innerHTML} /> :
        <circle className="handle"
                r={r}
                fill={ds.circleColor[status]}
                opacity="1">
        </circle>;

    const bgColor = ds.bgColor[status];
    const bgOpacity = ds.bgOpacity[status];
    const bgRadius = r + (ds.bgRadiusDiff * scale);
    const bgCircle = <circle className="node-background" r={bgRadius} fill={bgColor} opacity={bgOpacity}></circle>;

    return {
      groupId: `node-${n.id}`,
      circle: circle,
      rects: rects,
      tspans: tspans,
      bgCircle: bgCircle,
      transform: `translate(${x}, ${y})`
    };
  }

  _textLines(text){
    const maxWidth = text.length > 40 ? 30 : 20;
    let words = text.trim().split(" "),
        wordCount = words.length,
        word,
        lines = [],
        lineNumber = 1,
        line = "",
        lineWords = [],
        wordNumber = 1;

    while (word = words.shift()) {
      lineWords.push(word);
      line = lineWords.join(" ");

      if (line.length > maxWidth) {
        lineWords.pop();
        line = lineWords.join(" ");
        lines.push(line);
        lineNumber += 1;
        lineWords = [word];
      }
    }

    if (line = lineWords.join(" ")) {
      if (line.length < 4) {
        lines.push(lines.pop() + " " + line);
      } else {
        lines.push(line);
      }
    }

    return lines;
  }
}