var BaseComponent = require('./BaseComponent');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
var lsApi = require('../api/lsApi');
//require('../../styles/_main.scss');


class SearchContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchContainer';
    this.state = {results: []};
  }
  render(){
    return (
      <div className="searchContainer">
        <SearchForm handleSubmit={this.props.handleSearchSubmit} ref="searchForm" />
        <SearchResults query={this.props.query} results={this.props.results} addNode={this.props.addNode} />
      </div>
    );
  }
}

module.exports = SearchContainer;
