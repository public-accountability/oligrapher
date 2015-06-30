const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class EmptyInfo {
  render(){
    return (
      <div className='emptyInfo'></div>
    );
  }
}

module.exports = EmptyInfo;
