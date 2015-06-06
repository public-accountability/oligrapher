const React = require('react');
const SearchResult = require('./SearchResult');
const Marty = require('marty');

class SearchResults extends React.Component {
  render(){
    return (
      <div className={`searchResults ${this.props.visible ? '' : 'hidden'}`}>
        { this.props.results.map(r =>
            <SearchResult result={r} />) }
      </div>
    );
  }
}

module.exports = Marty.createContainer(SearchResults);
