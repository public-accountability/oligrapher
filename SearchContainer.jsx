var React = require('react');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
var apiService = require('./util/apiService')
var FAKE_RESULTS = require('./test/support/sampleData.js')
                            .fakeResults
                            .Response
                            .Data
                            .Entities
                            .Entity;
/**
* Heirarchy:
* - SearchContainer
*   - SearchForm
*   - SearchResults
* */

module.exports = React.createClass({
  displayName: 'SearchContainer',
  onSearchSubmit: function(query){
    var that = this;
    apiService.searchEntities(query, function(err,res){
        if (err) console.error(JSON.sringify(err));
        else that.setState({results: res});
      }
    );
    /* this.setState({results: FAKE_RESULTS}); */
  },
  getInitialState: function(){
    return {results: []};
  },
  render: function () {
    return (
      <div className="searchContainer">
        <h1>Search</h1>
        <SearchForm onSubmit={this.onSearchSubmit}/>
        <SearchResults results={this.state.results}/>
      </div>
    );
  }
});
