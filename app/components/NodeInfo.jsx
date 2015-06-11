const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class NodeInfo extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="nodeInfo">
        <h2>{this.props.info.get('title')}</h2>
        <div className="nodeInfoText">
          {this.props.info.get('text')}
        </div>
        <div className="nodeInfoLongText">
          {this.props.info.get('longText')}
        </div>
      </div>
    );
  }
}

module.exports = NodeInfo;
