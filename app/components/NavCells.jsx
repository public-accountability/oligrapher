const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const NavCell = require('./NavCell');


class NavCells extends BaseComponent {
  render() {
    return (
      <div className="navCells">
        {this.props.cells.map(c => <NavCell cell={c} />)}
      </div>
    );
  }
}

module.exports = Marty.createContainer(NavCells);
