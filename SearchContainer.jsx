var BaseComponent = require('./BaseComponent');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
var apiService = require('./util/apiService');

/**
* Heirarchy:
* - SearchContainer
*   - SearchForm
*   - SearchResults
* */

class SearchContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchContainer';
    this.state = {results: []};
    this.bindAll('handleSearchSubmit');
  }
  handleSearchSubmit(query){
    var that = this;
    apiService.searchEntities(query, (err, res) => {
      if (err) console.error(JSON.stringify(err));
      else that.setState({results: res});
    });
  }
  render(){
    return (
      <div className="searchContainer">
        <h1>Search</h1>
        <SearchForm handleSubmit={this.handleSearchSubmit}/>
        <SearchResults results={this.state.results}/>
      </div>
    );
  }
}

module.exports = SearchContainer;
