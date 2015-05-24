var BaseComponent = require('./BaseComponent');

class Node extends BaseComponent {
  constructor(){
    super();
    this.displayName = "Node";
  }
  render() {
    return (
      <div className="node">
        {this.props.node.item.name}
      </div>
    );

  }
}

module.exports = Node;
