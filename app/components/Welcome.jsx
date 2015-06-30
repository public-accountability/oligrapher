const BaseComponent = require('./BaseComponent');
const DeckList = require('./DeckList');

class Welcome extends BaseComponent {
  constructor(options){
    super(options);
  }

  render(){
    return (
      <div id="welcome">
        <h1>
          Welcome to the Show
        </h1>

        <p>Here you can view some interesting influence maps from <a href="http://littlesis.org">LittleSis</a>.</p>

        <br />
        <h3>Webs of Influence</h3>
        <DeckList />
      </div>
    );
  }
}

module.exports = Welcome;