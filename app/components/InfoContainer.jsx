const React = require('react');
const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const GraphInfo = require('./GraphInfo');
const NodeInfo = require('./NodeInfo');
const EmptyInfo = require('./EmptyInfo');

class InfoContainer extends BaseComponent {
  render(){
    return (
      <div className="infoContainer">
        {{
          map: <GraphInfo info={this.props.info} />,
          node: <NodeInfo info={this.props.info} />,
          empty: <EmptyInfo />
         }[this.props.infoType] }
      </div>
    );
  }

}

module.exports = Marty.createContainer(InfoContainer, {
  listenTo: ['infoStore'],
  fetch: {
    infoType(){
      return this.app.infoStore.state.type;
    },
    info() {
      const { infoStore, deckStore } = this.app;
      return {
        map: () => infoStore.getGraphInfo(this.app.deckStore.getCurrentGraphId()),
        node: () => infoStore.getNodeInfo(),
        empty: () => {}
      }[infoStore.state.type]();
    }
  }
});
