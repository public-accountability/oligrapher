const React = require('react');
const SearchResult = require('./SearchResult');
const Marty = require('marty');

class SearchResults extends React.Component {
  constructor(){
    super();
    this.displayName = 'SearchResults';
  }
  render(){
    let results = this.props.results.map(r =>
      <SearchResult result={r} addNode={this.props.addNode}/>);
    return (
      <div className="searchResults">
        {results}
      </div>
    );
  }
}

module.exports = Marty.createContainer(SearchResults, {
  listenTo: ['EntitySearchStore'],
  fetch: {
    results() {
      return this.app.EntitySearchStore.getResults();
    }
  }
});
