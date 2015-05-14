var React = require('react');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
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
    console.log(query);
    this.setState({results: FAKE_RESULTS});
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
