const BaseComponent = require('./BaseComponent');
const GraphContainer = require('./GraphContainer');
const { Row, Col } = require('react-bootstrap');

class MainContainer extends BaseComponent {
  render() {
    return (
      <Row className="mainContainer">
        <GraphContainer />
      </Row>
    );
  }
}

module.exports = MainContainer;
