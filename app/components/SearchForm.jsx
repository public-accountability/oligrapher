const React = require('react');
const BaseComponent = require('./BaseComponent');
const Marty = require('marty');

class SearchForm extends BaseComponent {
  constructor() {
    super();
    this.bindAll('handleSubmit');
  }
  handleSubmit(e){
    e.preventDefault();
    var qNode = React.findDOMNode(this.refs.query);
    var query = qNode.value.trim();
    this.app.entitySearchActions.search(query);
    qNode.value = '';
    return;
  }
  render(){
    return (
      <form className="searchForm" onSubmit={this.handleSubmit}>
        <input className="searchInput" type="text" placeholder="Search..." ref="query" />

      </form>
    );
  }
}

module.exports = Marty.createContainer(SearchForm);
