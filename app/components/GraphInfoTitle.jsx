const React = require('react');
const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class GraphInfoTitle extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="mapInfo">
        <div className="title">
          <h2>{this.props.info.title}</h2>
        </div>
      </div>
    );
  }
}

module.exports = Marty.createContainer(GraphInfoTitle, {
  listenTo: ['deckStore'],
  fetch: {
    info() {
      return this.app.infoStore.getGraphInfo(this.app.deckStore.getCurrentGraphId());
    }
  }
});