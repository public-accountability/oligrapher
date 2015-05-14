var React = require('react');

module.exports = React.createClass({
  displayName: 'SearchForm',
  onSubmit: function(e){
    e.preventDefault();
    var query = React.findDOMNode(this.refs.query).value.trim();
    this.props.onSubmit(query);
    React.findDOMNode(this.refs.query).value = '';
    return;
  },
  render: function(){
    return(
      <form classNanme="searchContainer" onSubmit={this.onSubmit} >
        <input type="text" placeholder="Enter a name..." ref="query" />
        <input type="submit" value="Search"/>
      </form>
    );
  }
});
