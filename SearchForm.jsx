'use strict'

var React = require('react');

module.exports = React.createClass({
  displayName: 'SearchForm',
  render: function(){
    return(
      <form classNanme="searchContainer" >
        <input type="text" placeholder="Enter a name..." ref="query" />
        <input type="submit" value="Post"/>
      </form>
    )
  };
});
