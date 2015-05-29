var BaseComponent = require('./BaseComponent');

class SearchResult extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchResult';
    this.bindAll('handleSearchResultClick');
  }
  render() {
    return (
      <div className="searchResult" onClick={this.handleSearchResultClick}>
        <a href="#">
          {this.props.result.name} ({this.props.result.primary_type})
        </a>
      </div>
    );
  }
  handleSearchResultClick(){
    this.props.addNode(this.props.result);
  }
}

module.exports = SearchResult;
