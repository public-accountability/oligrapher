const React = require('react');
const BaseComponent = require('./BaseComponent');

class EmptyContent extends BaseComponent {
  constructor(options){
    super(options);
  }

  render(){
    return (
      <div id="empty">
      </div>
    );
  }
}

module.exports = EmptyContent;