var BaseComponent = require('./BaseComponent');
var SearchForm = require('./SearchForm');
var SearchResults = require('./SearchResults');
var lsApi = require('../api/lsApi');
//require('../../styles/_main.scss');


class SearchContainer extends BaseComponent {
  constructor(){
    super();
    this.displayName = 'SearchContainer';
    this.state = {results: []};
    this.bindAll('handleSearchSubmit');
  }
  handleSearchSubmit(query){
    var that = this;
    lsApi.searchEntities(query).then(
      (res) => that.setState({results: res}),
      (err) => console.error(JSON.stringify(err))
    );
  }
  render(){
    return (
      <div className="searchContainer">
        <SearchForm handleSubmit={this.handleSearchSubmit}/>
        <SearchResults results={this.state.results} addNode={this.props.addNode} />
      </div>
    );
  }
}

module.exports = SearchContainer;
