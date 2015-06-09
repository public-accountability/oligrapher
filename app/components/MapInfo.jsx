const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class MapInfo extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="mapInfo">
      </div>
    );
  }
}

module.exports = MapInfo;