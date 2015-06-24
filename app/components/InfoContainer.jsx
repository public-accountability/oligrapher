const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const GraphInfo = require('./GraphInfo');
const NodeInfo = require('./NodeInfo');
const EmptyInfo = require('./EmptyInfo');
const { Map } = require('immutable');

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
      return this.app.infoStore.state.get('type');
    },
    info() {
      const { infoStore, graphStore } = this.app;
      return {
        map: () => infoStore.getGraphInfo(),
        node: () => infoStore.getNodeInfo(),
        empty: () => Map({})
      }[infoStore.state.get('type')]();
    }
  }
});
