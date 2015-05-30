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
          {this.props.result.name} ({this.props.result.primary_type})
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
