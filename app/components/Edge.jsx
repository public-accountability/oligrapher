const BaseComponent = require('./BaseComponent');
const Draggable = require('react-draggable');
const Marty = require('marty');

class Edge extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Edge";
  }
  render() {
    var e = this.props.edge;
    var curve = `M ${e.n1.display.x} ${e.n1.display.y} L ${e.n2.display.x} ${e.n2.display.y}`;
    return (
        <path d={curve} stroke="black">
        </path>
    );

  }
}

module.exports = Marty.createContainer(Edge);
