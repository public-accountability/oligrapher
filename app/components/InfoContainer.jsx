const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const MapInfo = require('./MapInfo');
const EntityInfo = require('./EntityInfo');

class InfoContainer extends BaseComponent {
  constructor() {
    super();
  }

  contentFor(type = 'blank', id = null) {
    return {
      map: <MapInfo id={id} />,
      entity: <EntityInfo id={id} />,
      blank: <div>Welcome to the maps!</div>
    }[type];
  }

  render(){
    let content = this.contentFor(this.props.type, this.props.id);
    return (
      <div className="infoContainer">
        {content}
      </div>
    );
  }
}

module.exports = InfoContainer