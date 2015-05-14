var React = require('react');
var SearchContainer = require('./SearchContainer');
var FAKE_RESULTS = require('./test/support/sampleData.js').fakeResults;


<<<<<<< HEAD
React.render(
  <SearchContainer results={FAKE_RESULTS} />,
  document.getElementById('content')
);
=======
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
>>>>>>> e08188abb1ac1b1ee361dc4831ac0560b52f4351
