const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class EmptyInfo {
  render(){
    return (
      <div className='emptyInfo'>Welcome to the Show!</div>
    );
  }
}

module.exports = EmptyInfo;
