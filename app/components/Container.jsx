//var React = require('react');
var BaseComponent = require('./BaseComponent');
var CanvasContainer = require('./CanvasContainer');
var SearchContainer = require('./SearchContainer');

class Container extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Container';
  }
  render(){
    return (
      <div className="container">
        <h1>Show Me The Money!</h1>
        <div class="row">
          <CanvasContainer />
          <SearchContainer />
        </div>
      </div>
    );
  }
}

module.exports = Container;
