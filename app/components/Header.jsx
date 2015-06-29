const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const SearchBox = require('./SearchBox');
const { Grid, Row, Col, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');
const GraphConstants = require('../constants/GraphConstants');
const _ = require('underscore');
const yarr = require('../yarr.js');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    return (
      <Row className="header">
        <Navbar
          brand="Show Me The Money!"
          className="navbar"
          fluid={true}
          fixedTop={true} >
          <Nav className="nav">
            <DropdownButton eventKey={1} title="Webs of Influence" className="nav-dropdown">
              {_.map(this.props.decks, (d,i) =>
                <MenuItem onSelect={this._handleMapNavClick.bind(this, d.slug())}>
                  {d.title}
                </MenuItem>
              )}
            </DropdownButton>
          </Nav>
        </Navbar>
      </Row>
    );
  }
  _handleMapNavClick(id){
    yarr(`/maps/${id}`);
    //this.app.deckActions.selectDeck(index);
  }
}

module.exports = Marty.createContainer(Header, {
  listenTo: ['deckStore'],
  fetch: {
    decks(){
      return _.values(this.app.deckStore.state.decks);
    }
  }
});
