const BaseComponent = require('./BaseComponent');
const Draggable = require('react-draggable');
const Marty = require('marty');
const NodeDisplaySettings = require('../NodeDisplaySettings');

class Node extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Node";
    this.bindAll('textLines', 'handleDrag');
  }


  textLines(text){
    let words = text.split(" "),
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

      if (line.length > 20) {
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

  handleDrag(e, ui) {
    this.app.graphActions.moveNode(this.props.node.id, ui.position);
  }

  render() {
    let n = this.props.node;
    let ds = NodeDisplaySettings;
    let r = ds.defaultCircleRadius * n.display.scale;
    let textOffsetY = ds.textMarginTop + r;
    let textLines = this.textLines(n.display.name);
    let tspans = textLines.map((line, i) => {
      let dy = (i == 0 ? textOffsetY : 0) + (i * ds.lineHeight);
      return <tspan className="node-text-line" x="0" dy={dy}>{line}</tspan>;
    });
    let rects = textLines.map((line, i) => {
      let width = line.length * 8;
      let height = ds.lineHeight;
      let y = r + 5 + (i * ds.lineHeight);
      return <rect fill="#fff" opacity="0.8" rx={ds.cornerRadius} ry={ds.cornerRadius} x={-width/2} width={width} height={height} y={y} />;
    });
    let groupId = `node-${n.id}`;
    let clipId = `image-clip-${n.id}`;
    let clipPath = `url(#${clipId})`;
    let imageWidth = r * ds.imageScale;
    let innerHTML = { __html: `<clipPath id="${clipId}"><circle r="${r}" opacity="1"></circle>
          </clipPath><image className="handle" x="${-imageWidth/2}" y="${-imageWidth/2}" xlink:href="${n.display.image}" height="${imageWidth}" width="${imageWidth}" clip-path="${clipPath}"></image>` };
    let circle = n.display.image ? <g dangerouslySetInnerHTML={innerHTML} /> : <circle className="handle" r={r} fill={ds.defaultCircleColor} opacity="1"></circle>;

    return (
      <Draggable
        handle=".handle"
        start={{x: n.display.x, y: n.display.y}}
        moveOnStartChange={false}
        zIndex={100}
        onDrag={this.handleDrag} >

        <g id={groupId}>
          {circle}
          {rects}
          <text dy={textOffsetY} textAnchor="middle">
            {tspans}
          </text>
        </g>

      </Draggable>
    );

  }
}

module.exports = Marty.createContainer(Node);