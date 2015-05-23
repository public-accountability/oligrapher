var BaseComponent = require('./BaseComponent');

class Canvas extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'Canvas';
  }
  render(){
    return (
      <div className="canvasContainer">
        Put Stuff Here!
      </div>
    );
  }
}

module.exports = Canvas;
