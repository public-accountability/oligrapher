const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const SearchBox = require('./SearchBox');
const { Grid, Row, Col, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');
const GraphConstants = require('../constants/GraphConstants');
const _ = require('underscore');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    /* const decks = [
       { title: 'Mitchell Family Foundation', id: 146},
       { title: 'Frackademia', id: 282 }
       ]; */
    return (
      <Row className="header">
        <Navbar
          brand="Show Me The Money!"
          className="navbar"
          fluid={true}
          fixedTop={true} >
          <Nav className="nav">
            <DropdownButton eventKey={1} title="Webs of Influence" className="nav-dropdown">
              {this.props.decks.map(d =>
                <MenuItem onSelect={this._handleMapNavClick.bind(this, d.id)}>
                  {d.title}
                </MenuItem>
              )}
            </DropdownButton>
          </Nav>
          <SearchBox />
        </Navbar>
      </Row>
    );
  }
  _handleMapNavClick(id){
    this.app.deckActions.selectDeck(id);
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
