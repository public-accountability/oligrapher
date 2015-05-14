var React = require('react');
var SearchContainer = require('./SearchContainer');
var FAKE_RESULTS = require('./test/support/sampleData.js').fakeResults;

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
