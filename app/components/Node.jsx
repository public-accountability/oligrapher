const BaseComponent = require('./BaseComponent');
const Draggable = require('react-draggable');
const Marty = require('marty');
const ds = require('../NodeDisplaySettings');

class Node extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Node";
    this.bindAll('_handleDrag', '_handleClick');
  }

  render() {
    const n = this.props.node;
    const sp = this._getSvgParams(n);

    return (
      <Draggable
        handle=".handle"
        start={{x: n.display.x, y: n.display.y}}
        moveOnStartChange={false}
        zIndex={100}
        onDrag={this._handleDrag}
      >

        <g id={sp.groupId}>
          {sp.bgCircle}
          {sp.circle}
          {sp.rects}
          {sp.tspans}
        </g>

      </Draggable>
    );
  }

  _handleDrag(e, ui) {
    this.app.graphActions.moveNode(this.props.node.id, ui.position);
  }

  _handleClick(node){
    //TODO -- add conditional handling
    this.app.graphActions.clickNode(this.props.node.id);
  }

  _getSvgParams(node) {

    let n = node;
    let r = ds.defaultCircleRadius * n.display.scale;
    let textOffsetY = ds.textMarginTop + r;
    let textLines = this._textLines(n.display.name);

    let tspans =
          <a className="nodeLabel" onClick={this._handleClick}>
            <text textAnchor="middle">
              {
                textLines.map(
                 (line, i) => {
                   let dy = (i == 0 ? textOffsetY : ds.lineHeight);
                   return <tspan className="node-text-line" x="0" dy={dy} fill={ds.textColor[n.display.status]}>{line}</tspan>;
                 })
              }
            </text>
          </a>;

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
    let imageOpacity = ds.imageOpacity[n.display.status];
    let innerHTML = { __html:
                      `<clipPath id="${clipId}">
                         <circle r="${r}" opacity="1"></circle>
                       </clipPath>
                       <image
                         class="handle"
                         x="${-imageWidth/2}"
                         y="${-imageWidth/2}"
                         xlink:href="${n.display.image}"
                         height="${imageWidth}"
                         width="${imageWidth}"
                         opacity="${imageOpacity}"
                         clip-path="${clipPath}">
                       </image>` };

    const circle =
      n.content.entity.type == "Person" && n.display.image ?
        <g dangerouslySetInnerHTML={innerHTML} /> :
        <circle className="handle"
                r={r}
                fill={ds.circleColor[n.display.status]}
                opacity="1">
        </circle>;

    const bgColor = ds.bgColor[n.display.status];
    const bgOpacity = ds.bgOpacity[n.display.status];
    const bgCircle = <circle className="node-background" r={r+ds.bgRadiusDiff} fill={bgColor} opacity={bgOpacity}></circle>;

    return {
      groupId: `node-${n.id}`,
      circle: circle,
      rects: rects,
      tspans: tspans,
      bgCircle: bgCircle
    };
  }

  _textLines(text){
    const maxWidth = text.length > 40 ? 30 : 20;
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

module.exports = Marty.createContainer(Node);
