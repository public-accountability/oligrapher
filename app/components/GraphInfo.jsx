const Marty = require('marty');
const BaseComponent = require('./BaseComponent');

class GraphInfo extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    return (
      <div className="mapInfo">
        <h2>{this.props.info.get('title')}</h2>
        <div className="mapInfoDesription"
             dangerouslySetInnerHTML=
             { { __html: this.props.info.get('description') } } />
      </div>
    );
  }
}

module.exports = GraphInfo;
