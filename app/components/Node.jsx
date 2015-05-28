var BaseComponent = require('./BaseComponent');
var Draggable = require('react-draggable');

class Node extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Node";
    this.bindAll('handleDrag');
  }
  handleDrag(e, ui) {
    this.props.handleDrag(this.props.node.id, ui.position);
  }
  render() {
    return (
      <Draggable
        handle=".handle"
        start={{x: this.props.node.display.x, y: this.props.node.display.y}}
        moveOnStartChange={false}
        zIndex={100}
        onDrag={this.handleDrag} >

        <g>
          <circle className="handle" r="30" fill="#88f" opacity="1"></circle>
          <text dy="50" textAnchor="middle">
            {this.props.node.display.name}
          </text>
        </g>

      </Draggable>
    );

  }
}

module.exports = Node;
