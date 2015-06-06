const BaseComponent = require('./BaseComponent');
const Marty = require('marty');

class NavHeader extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_handleClick');
  }
  render() {
    return (
      <div className="navHeader" onClick={this._handleClick} >
        <a href="#">
          {this.props.name}
        </a>
      </div>
    );
  }
  _handleClick(){
    this.app.navActions.clickHeader(this.props.name);
  }
}

module.exports = Marty.createContainer(NavHeader);
