const BaseComponent = require('./BaseComponent');
const GraphContainer = require('./GraphContainer');
const { Row, Col } = require('react-bootstrap');
const InfoContainer = require('./InfoContainer');
const DeckTitle = require('./DeckTitle');

class MainContainer extends BaseComponent {
  render() {
    return (
      <Row className="mainContainer">
        <Col md={8}>
          <DeckTitle />
          <GraphContainer />
        </Col>
        <Col md={4}>
          <InfoContainer />
        </Col>
      </Row>
    );
  }
}

module.exports = MainContainer;
