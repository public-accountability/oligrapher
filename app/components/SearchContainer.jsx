var BaseComponent = require('./BaseComponent');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
var lsApi = require('../api/lsApi');
//require('../../styles/_main.scss');

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
    lsApi.searchEntities(query, (err, res) => {
      if (err) console.error(JSON.stringify(err));
      else that.setState({results: res});
    });
  }
  render(){
    return (
      <div className="searchContainer">
         <SearchForm handleSubmit={this.handleSearchSubmit}/>
        <SearchResults results={this.state.results}/>
      </div>
    );
  }
}

module.exports = SearchContainer;
