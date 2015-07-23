const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class NodeInfo extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="nodeInfo">
        <h2>{this.props.info.title}</h2>
        <div className="nodeInfoText">
          {this.props.info.text}
        </div>
        <div className="nodeInfoLongText">
          {this.props.info.longText}
        </div>
      </div>
    );
  }
}

module.exports = NodeInfo;
