const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const NavBar = require('./NavBar');
const SearchContainer = require('./SearchContainer');
const { Row, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');
const GraphConstants = require('../constants/GraphConstants');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    const maps = [
      { name: 'Mitchell Family Founctaion', id: 556},
      { name: 'Frackademia', id: 507},
      { name: 'Andrew Cuomo', id: 456 },
      { name: 'Hillary Clinton', id: 431 }
    ]
    return (
      <Row className="header">
        <Navbar brand="Show Me The Money!" className="navbar">
          <Nav className="nav">
            <DropdownButton eventKey={1} title="Maps">
              {maps.map(m =>
                <MenuItem onClick={this._handleMapNavClick.bind(this, m.id)}>
                  {m.name}
                </MenuItem>
              )}
            </DropdownButton>
          </Nav>
        </Navbar>
        <SearchContainer />
      </Row>

    );
  }
  _handleMapNavClick(id){
    this.app.graphActions.showGraph(id);
  }
}

module.exports = Marty.createContainer(Header);
