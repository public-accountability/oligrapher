const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const MapInfo = require('./MapInfo');
const EntityInfo = require('./EntityInfo');
const EmptyInfo = require('./EmptyInfo');
const { Map } = require('immutable');

class InfoContainer extends BaseComponent {
  render(){
    return (
      <div className="infoContainer">
        {{
          map: <MapInfo info={this.props.info} />,
          entity: <EntityInfo info={this.props.info} />,
          empty: <EmptyInfo />
         }[this.props.infoType] }
      </div>
    );
  }

}

module.exports = Marty.createContainer(InfoContainer, {
  listenTo: ['infoStore'],
  fetch: {
    info(){
      const { infoStore, graphStore } = this.app;
      switch(infoStore.state.get('type')){
        case 'map':
          return infoStore.getGraphInfo()
        case 'empty':
          return Map({});
      }
    },
    infoType(){
      return this.app.infoStore.state.get('type');
    }
  }

});
