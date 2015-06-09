const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class EntityInfo extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="entityInfo">
        Hi!
      </div>
    );
  }
}

module.exports = EntityInfo;