var React = require('react');
require('../../styles/_main.scss');

class SearchResult extends React.Component {
  constructor(){
    super();
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
