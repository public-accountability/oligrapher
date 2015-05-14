var React = require('react');
var SearchContainer = require('./SearchContainer');
var FAKE_RESULTS = require('./test/support/sampleData.js')
                            .fakeResults
                            .Response
                            .Data
                            .Entities
                            .Entity;

console.log(FAKE_RESULTS);

var MainClass = React.createClass({
  render: function () {
    'use strict';
    return (
      <SearchContainer results={this.props.results}/>
    );
  }
});

module.exports = MainClass;

React.render(
  <MainClass results={FAKE_RESULTS}/>,
  document.getElementById('content')
);
