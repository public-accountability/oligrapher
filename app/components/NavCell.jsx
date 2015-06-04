const BaseComponent = require('./BaseComponent');
const Marty = require('marty');

class NavCell extends BaseComponent {
  render() {
    return (
      <div className="navCell">
        {this.props.cell.name}
      </div>
    );
  }
}

module.exports = Marty.createContainer(NavCell);
