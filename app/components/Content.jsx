const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const GraphContainer = require('./GraphContainer');
const { Row, Col } = require('react-bootstrap');
const InfoContainer = require('./InfoContainer');
const DeckTitle = require('./DeckTitle');
const DeckNavButtons = require('./DeckNavButtons');
const Welcome = require('./Welcome');
const EmptyContent = require('./EmptyContent');

class Content extends BaseComponent {
  render() {
    return (
      <div id="mainContainer">
        { { 
          empty: <EmptyContent />,
          home: <Welcome />, 
          deck: (
            <Row id="mainRow">
              <Col id="graphCol" md={8}>
                <DeckTitle />
                <DeckNavButtons />
                <GraphContainer />
              </Col>
              <Col md={4}>
                <InfoContainer />
              </Col>
            </Row>
          )
        }[this.props.content] }
      </div>
    );
  }
}

module.exports = Marty.createContainer(Content, {
  listenTo: ['contentStore'],
  fetch: {
    content() {
      return this.app.contentStore.getContent();
    }
  }
});