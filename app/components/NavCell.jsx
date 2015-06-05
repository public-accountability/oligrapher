const BaseComponent = require('./BaseComponent');
const Marty = require('marty');

class NavCell extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_handleClick');
  }
  render() {
    return (
      <div className="navCell" onClick={this._handleClick}>
        <a href="#">
          {this.props.cell.name}
        </a>
      </div>
    );
  }
  _handleClick(){
    this.app.navActions.clickCell(this.props.cell);
  }
}

module.exports = Marty.createContainer(NavCell);
