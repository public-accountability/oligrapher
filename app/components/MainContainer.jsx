const BaseComponent = require('./BaseComponent');
const GraphContainer = require('./GraphContainer');
const { Row, Col } = require('react-bootstrap');
const InfoContainer = require('./InfoContainer');

class MainContainer extends BaseComponent {
  render() {
    return (
      <Row className="mainContainer">
        <Col md={8}>
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
