var React = require('react');
var SearchResult = require('./SearchResult');

class SearchResults extends React.Component {
  constructor(){
    super();
    this.displayName = 'SearchResults';
  }
  render(){
    var results = this.props.results.map(r =>
      <SearchResult result={r} />
    );
    return (
      <div className="searchResults">
        {results}
      </div>
    );
  }
}
module.exports = SearchResults;
