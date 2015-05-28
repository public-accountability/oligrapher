var BaseComponent = require('./BaseComponent');
var Draggable = require('react-draggable');

class Edge extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Edge";
  }
  render() {
    var e = this.props.edge;
    var curve = `M ${this.props.edge.n1.x} ${this.props.edge.n1.y} L ${e.n2.x} ${e.n2.y}`
    return (
        <path d={curve} stroke="black">
        </path>
    );

  }
}

module.exports = Edge;
