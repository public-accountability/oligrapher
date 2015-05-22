var BaseComponent = require('./BaseComponent');

class CanvasContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'CanvasContainer';
  }
  render(){
    return (
      <div className="canvasContainer">
        Put Stuff Here!
      </div>
    );
  }
}

module.exports = CanvasContainer;
