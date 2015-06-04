const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const NavHeader = require('./NavHeader');
const NavCells = require('./NavCells');

class NavColumn extends BaseComponent {
  render() {
    return (
      <div className="navColumn">
        <NavHeader name={this.props.col.header} selected={this.props.col.selected} />
        <NavCells cells={this.props.col.cells} />
      </div>
    );
  }
}

module.exports = Marty.createContainer(NavColumn);
