var React = require('react');
var SearchContainer = require('./SearchContainer');

var MainClass = React.createClass({
  render: function () {
    'use strict';
    return (
      <SearchContainer />,
      document.getElementById('content')
    );
  }
});

module.exports = MainClass;
