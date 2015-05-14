var React = require('react');
var SearchResult = require('./SearchResult');

module.exports = React.createClass({
  displayName: 'SearchResults',
  render: function(){
    var resNodes = this.props.results.map(function(result){
      return (
        <SearchResult result={result} />
      );
    });
    return (
      <div className="searchResults">
        {resNodes}
      </div>
    );
  }
});
