const BaseComponent = require('./BaseComponent');
const Draggable = require('react-draggable');
const Marty = require('marty');

class Edge extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Edge";
    this.bindAll('handleStart', 'handleDrag');
  }
  handleStart(event, ui) {
    // subtract existing control point position from start position so that dragging adds to existing curve instead of replacing it
    let e = this.props.edge;
    this.startDrag = ui.position;
    this.startPosition = { left: e.display.x, top: e.display.y };
    console.log("START POSITION", this.startPosition.left, this.startPosition.top);
    this.startDrag.left = this.startDrag.left - e.display.cx;
    this.startDrag.top = this.startDrag.top - e.display.cy;
  }
  handleDrag(event, ui) {
    let cx = ui.position.left - this.startDrag.left;
    let cy = ui.position.top - this.startDrag.top;
    let x = this.startPosition.left;
    let y = this.startPosition.top;
    console.log("POSITION", x, y);
    this.app.graphActions.moveEdge(this.props.edge.id, x, y, cx, cy);
  }
  render() {
    let e = this.props.edge;
    let transform = `translate(${e.display.x}, ${e.display.y})`;
    let curve = `M ${e.display.xa}, ${e.display.ya} Q ${e.display.cx}, ${e.display.cy}, ${e.display.xb}, ${e.display.yb}`;
    let groupId = `edge-${e.id}`;
    let pathId = `path-${e.id}`;
    let dash = e.display.dash ? "5, 2" : "";
    let fontSize = 10 * Math.sqrt(e.display.scale);
    let dy = -6 * Math.sqrt(e.display.scale);
    let strokeWidth
    let textPath = { __html: `<textPath class="labelpath" startOffset="50%" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${pathId}" font-size="${fontSize}">${e.display.label}</textPath>` };
    let text = <text dy={dy} fill="#999" textAnchor="middle" dangerouslySetInnerHTML={textPath}></text>;
    let markerStart = (e.display.is_directional && e.display.is_reverse) ? "url(#marker2)" : "";
    let markerEnd = (e.display.is_directional && !e.display.is_reverse) ? "url(#marker1)" : "";

    return (
      <Draggable
        handle=".handle"
        axis="none"
        start={{x: this.props.edge.display.x, y: this.props.edge.display.y}}
        moveOnStartChange={false}
        zIndex={100}
        onStart={this.handleStart}
        onDrag={this.handleDrag} >

        <g id={groupId}>
          <path className="handle edge-background" d={curve} stroke="white" strokeOpacity="0" strokeWidth="5" fill="none"></path>
          <path id={pathId} className="edge-line" d={curve} stroke="black" strokeDasharray={dash} strokeWidth={e.display.scale} fill="none" markerStart={markerStart} markerEnd={markerEnd}></path>
          {text}
        </g>

      </Draggable>
    );

  }
}

module.exports = Marty.createContainer(Edge);
