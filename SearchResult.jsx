var React = require('react');

class SearchResult extends React.Component {
  constructor(options){
    super(options);
    this.displayName = 'SearchResult';
  }
  render() {
    return (
      <div className="searchResult">
        {this.props.result.name} ({this.props.result.primary_type})
      </div>
    );
  }
}

module.exports = SearchResult;
