const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const { Combobox, configure } = require('react-widgets');
const lsApi = require('../api/lsApi');
const converter = require('../models/Converter');

class SearchBox extends BaseComponent {
  constructor(options){
    super(options);
    this.bindAll('_submitSearch', '_handleSearchResultClick');
    //this.state = ({picked: {}});
  }
  render(){
    return (
      <Combobox
        valueField='id'
        textField='name'
        className="searchBox"
        data={this.props.results}
        placeholder='Search..'
        onChange={ query => this._submitSearch(query)}
        onSelect={ entity => this._handleSearchResultClick(entity)}
      />
    );
  }
  _submitSearch(query){
    this.app.entitySearchActions.search(query);
  }
  _handleSearchResultClick(entity){
    this.app.graphActions.addNode(
      converter.entityToNode(entity)
    );
  }
}

module.exports = Marty.createContainer(SearchBox, {
  listenTo: ['entitySearchStore'],
  fetch: {
    results() {
      return this.app.entitySearchStore.state.results;
    }
  }
});
