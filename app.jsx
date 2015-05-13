var SearchContainer = React.createClass({
  render: function () {
    return (
      <div className="searchContainer">
        <SearchForm />
        <SearchResults />
      </div>);
  }
});


var SearchForm = React.createClass({
  render: function () {
    return (
      <input type="text"/>
    );
  }
});

React.render(<SearchContainer />, document.getElementById('content'));
