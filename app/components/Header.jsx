const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const NavBar = require('./NavBar');
const SearchBox = require('./SearchBox');
const { Grid, Row, Col, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');
const GraphConstants = require('../constants/GraphConstants');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    const maps = [
      { name: 'Mitchell Family Foundation', id: 556},
      { name: 'Frackademia', id: 507},
      { name: 'Andrew Cuomo', id: 456 },
      { name: 'Hillary Clinton', id: 431 }
    ]
    return (
      <Row className="header">
        <Navbar brand="Show Me The Money!" className="navbar">
          <Col md={6} xs={12}>
          <Nav className="nav">
              <DropdownButton eventKey={1} title="Maps" className="nav-dropdown">
                {maps.map(m =>
                  <MenuItem
                    onSelect={this._handleMapNavClick.bind(this, m.id)}
                  >
                    {m.name}
                  </MenuItem>
                )}
              </DropdownButton>
          </Nav>
          </Col>
          <Col md={3} xs={12}>
         <SearchBox />
          </Col>
        </Navbar>
      </Row>
    );
  }
  _handleMapNavClick(id){
    this.app.graphActions.showGraph(id);
  }
}

module.exports = Marty.createContainer(Header);
