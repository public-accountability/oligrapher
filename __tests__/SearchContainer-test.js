// Search_integration_spec.js

var sd = require('../test/support/sampleData.js');

jest.dontMock('../app/Main');
jest.dontMock('../app/components/BaseComponent');
jest.dontMock('../app/components/SearchContainer');
jest.dontMock('../app/components/SearchForm');
jest.dontMock('../app/components/SearchResults.jsx');
jest.dontMock('../app/components/SearchResult.jsx');

describe('Main', function(){

  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Main = require('../app/Main.jsx');

  var main = TestUtils.renderIntoDocument(
      <Main /> );

  var form = TestUtils.findRenderedDOMComponentWithClass(
    main, 'searchForm');
  var button = TestUtils.findRenderedDOMComponentWithClass(
    main, 'searchSubmit');
  var input = TestUtils.findRenderedDOMComponentWithClass(
    main, 'searchInput');

  it('has a search form', function(){

    expect(button.props.type).toEqual('submit');
    expect(input.props.type).toEqual('text');

  });

  it('displays search results', function(){

    //TODO figure out integration tests!

    Main.handleSearchSubmit = jest.genMockFunction().mockImplementation(function(){
      this.setState({results: sd.searchEntitiesResult});
    });

    input.getDOMNode().value = 'Walmart';
    TestUtils.Simulate.submit(form);
    var results = TestUtils.findRenderedDOMComponentWithClass(
      container, 'searchResults');
    expect(results).toContain('Walmart');

  });
});
