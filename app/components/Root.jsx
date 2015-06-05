const BaseComponent = require('./BaseComponent');
const NavBar = require('./NavBar.jsx');
const GraphContainer = require('./GraphContainer');
const SearchContainer = require('./SearchContainer');
const { Grid, Row, Col } = require('react-bootstrap');

class Root extends BaseComponent {
  constructor(){
    super();
  }
  render() {
    return (
      <Grid className="root">
        <Row className="header">
          <h1>Show Me the Money!</h1>
          <NavBar />
        </Row>
        <Row className="mainContainer">
          <GraphContainer />
          <SearchContainer />
        </Row>
      </Grid>

    );
  }
}

module.exports = Root;
