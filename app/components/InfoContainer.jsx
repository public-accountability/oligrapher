const Marty = require('marty');
const BaseComponent = require('./BaseComponent');
const MapInfo = require('./MapInfo');
const EntityInfo = require('./EntityInfo');

class InfoContainer extends BaseComponent {
  constructor() {
    super();
    this.bindAll('_getInfo');
  }

  render(){
    return (
      <div className="infoContainer">
        {this._getInfo(this.props.type, this.props.id)}
      </div>
    );
  }

  _getInfo(type = 'blank', id) {
    return {
      map: <MapInfo id={id} />,
      entity: <EntityInfo id={id} />,
      blank: <div>Welcome to the maps!</div>
    }[type];
  }
}

module.exports = InfoContainer;
