var React = require('react');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');

/**
* Heirarchy:
* - SearchContainer
*   - SearchForm
*   - SearchResults
* */

module.exports = React.createClass({
  displayName: 'SearchContainer',
  render: function () {
    return (
      <div className="searchContainer">
        <h1>Search</h1>
        <SearchForm />
        <SearchResults results={this.props.results}/>
      </div>
    );
  }
});
