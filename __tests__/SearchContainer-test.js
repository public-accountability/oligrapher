// Search_integration_spec.js

jest.dontMock('../SearchContainer');
jest.dontMock('../SearchResults');
jest.dontMock('../SearchResult');
jest.dontMock('../SearchForm');

describe('SearchContainer', function(){

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;

  var SearchContainer = require('../SearchContainer.jsx');

  var container = TestUtils.renderIntoDocument(
      <SearchContainer /> );
  var button = TestUtils.findRenderedDOMComponentWithClass(
      container, 'searchSubmit');
  var input = TestUtils.findRenderedDOMComponentWithClass(
    container, 'searchInput');

  it('has a search form', function(){

    expect(button.props.type).toEqual('submit');
    expect(input.props.type).toEqual('text');

  });

  it('displays search results', function(){

    //TODO: figure out correct syntax for this

    // TestUtils.Simulate.change(input, { target: { value: "Walmart" }});
    // TestUtils.Simulate.keyDown(button, {key: "Enter"});

    // var result = TestUtils.findRenderedDOMComponentWithClass(
    //   container, 'searchResult');

    // console.log('result: ', result);
    // expect(true).toEqual(true);

  });
});
