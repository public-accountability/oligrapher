import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ds from '../NodeDisplaySettings';

export default class NodeLabel extends Component {
  render() {
    let n = this.props.node;
    let { name, url, scale, status } = n.display;
    let r = ds.circleRadius * scale;
    let textOffsetY = ds.textMarginTop + r;
    let textLines = this._textLines(name);
    
    let tspans = textLines.map((line, i) =>
      <tspan
        key={i}
        className="nodeLabelText"
        x="0"
        dy={i == 0 ? textOffsetY : ds.lineHeight}
        fill={ds.textColor[status]}
        opacity={ds.textOpacity[status]}>
        {line}
      </tspan>
    );

    let rects = textLines.map((line, i) => {
        let width = line.length * 8;
        let height = ds.lineHeight;
        let y = r + 4 + (i * ds.lineHeight);
        return <rect
                  key={i}
                  className="nodeLabelRect"
                  fill="#fff"
                  opacity="0.8"
                  rx={ds.cornerRadius}
                  ry={ds.cornerRadius}
                  x={-width/2}
                  width={width}
                  height={height}
                  y={y} />;
    });

    return (
      <g className="nodeLabel">
        {rects}
        <a className="nodeLabel" xlinkHref={url} target="_blank">
          <text textAnchor="middle"> 
            { tspans }
          </text>
        </a>
      </g>
    );
  }

  componentDidMount() {
    this._setRectWidths();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.node.display.name !== this.props.node.display.name) {
      this._setRectWidths();
    }
  }

  _setRectWidths() {
    let element = ReactDOM.findDOMNode(this);
    let texts = element.querySelectorAll(".nodeLabelText");
    let rects = element.querySelectorAll(".nodeLabelRect");

    for (var i = 0; i < rects.length; i++) {
      let textWidth = texts[i].getComputedTextLength();
      let width = textWidth + 10;
      rects[i].setAttribute("width", width);
      rects[i].setAttribute("x", -width/2);
    }
  }

  _textLines(text){
    const maxWidth = text.length > 40 ? 25 : 18;
    let words = text.trim().split(" "),
        word,
        lines = [],
        lineNumber = 1,
        line = "",
        lineWords = [];

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
      if (line.length < 4 && lines.length > 0) {
        lines.push(lines.pop() + " " + line);
      } else {
        lines.push(line);
      }
    }

    return lines;
  }
}