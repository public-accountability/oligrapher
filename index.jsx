'use strict'

var React = require('react');
var SearchContainer = require('./SearchContainer');
var FAKE_RESULTS = require('./test/support/sampleData.js').fakeResults;


React.render(
  <SearchContainer results={FAKE_RESULTS} />,
  document.getElementById('content')
);
