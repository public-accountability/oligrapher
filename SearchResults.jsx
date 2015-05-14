var React = require('react');
var SearchResult = require('./SearchResult');

module.exports = React.createClass({
  displayName: 'SearchResults',
  render: function(){
    var results = this.props.results.map(function(result){
      return (
        <SearchResult result={result} />
      );
    });
    return (
      <div className="searchResults">
        {results}
      </div>
    );
  }
});
