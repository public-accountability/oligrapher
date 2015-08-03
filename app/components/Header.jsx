const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const SearchBox = require('./SearchBox');
const { Grid, Row, Col, Navbar, Nav, NavItem, DropdownButton, MenuItem } = require('react-bootstrap');
const GraphConstants = require('../constants/GraphConstants');
const _ = require('underscore');
const yarr = require('yarr.js');
const RoutesHelper = require('../routes/RoutesHelper');
const config = require('../../config');

class Header extends BaseComponent {
  constructor(options){
    super(options);
  }
  render() {
    const brand = config.brandUrl ? <a href={config.brandUrl}><img id="logo" src={config.brandImageUrl} /></a> : <a href="" onClick={this._handleBrandClick}>{config.brandImageUrl}</a>;

    return (
      <Row className="header">
        <Navbar
          brand={brand}
          className="navbar"
          fluid={true}
          fixedTop={true} >
          <Nav className="nav">
            { _.map(config.navLinks, (val, key, i) => {
              return (typeof val  === "string") ? <NavItem eventKey={i} href={val}>{key}</NavItem> : ( 
                <DropdownButton eventKey={i} title={key} className="nav-dropdown">
                  { _.map(val, (v, k, j) => 
                    <MenuItem eventKey={j} href={v}>{k}</MenuItem>
                  ) }
                </DropdownButton> );
            }) }
          </Nav>
        </Navbar>
      </Row>
    );
  }

  _handleMapNavClick(deck) {
    yarr(RoutesHelper.mapUrl(deck));
  }

  _handleBrandClick() {
    yarr(RoutesHelper.homeUrl());
    return false;
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
