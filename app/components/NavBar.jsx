const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const NavColumn = require('./NavColumn');

class NavBar extends BaseComponent {
  render() {
    return (
      <div className="navBar">
        { this.props.menu.map(col => <NavColumn key={col.header} col={col} />) }
      </div>
    );
  }
}

module.exports = Marty.createContainer(NavBar, {
  listenTo: ['navStore'],
  fetch: {
    menu() {
      return this.app.navStore.state.menu;
    }
  }
});
