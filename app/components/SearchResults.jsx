const React = require('react');
const SearchResult = require('./SearchResult');
const Marty = require('marty');

class SearchResults extends React.Component {
  render(){
    let results = this.props.results.map(r =>
      <SearchResult result={r} />);
    return (
      <div className="searchResults">
        {results}
      </div>
    );
  }
}

module.exports = Marty.createContainer(SearchResults, {
  listenTo: ['entitySearchStore'],
  fetch: {
    results() {
      return this.app.entitySearchStore.getResults();
    }
  }
});
