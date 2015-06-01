const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const converter = require('../models/Converter');

class SearchResult extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchResult';
    this.bindAll('_handleSearchResultClick');
  }
  render() {
    return (
      <div className="searchResult" onClick={this._handleSearchResultClick}>
        <a href="#">
          {this.props.result.name}
        </a>
      </div>
    );
  }
  _handleSearchResultClick(){
    this.app.graphActions.addNode(
      converter.entityToNode(this.props.result)
    );
  }
}

module.exports = Marty.createContainer(SearchResult);
