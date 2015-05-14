var React = require('react');

module.exports = React.createClass({
  displayName: 'SearchResult',
  render: function(){
    return(
      <div className="searchResult">
        {this.props.result.name} ({this.props.result.primary_type})
      </div>
    );
  }
});
