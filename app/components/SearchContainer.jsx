const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const SearchForm = require('./SearchForm');
const SearchResults = require('./SearchResults');

class SearchContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchContainer';
  }
  render(){
    return (
      <div className="searchContainer">
        <SearchForm />
        <SearchResults results={this.props.results} visible={this.props.visible} />
      </div>
    );
  }
}

module.exports = Marty.createContainer(SearchContainer, {
  listenTo: ['entitySearchStore'],
  fetch: {
    results() {
      return this.app.entitySearchStore.state.results;
    },
    visible(){
      return this.app.entitySearchStore.state.visible;
    }
  }
});
