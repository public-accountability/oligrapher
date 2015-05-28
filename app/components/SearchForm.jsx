var React = require('react');
var BaseComponent = require('./BaseComponent');

class SearchForm extends BaseComponent {
  constructor() {
    super();
    this.displayName = 'SearchForm';
    this.bindAll('handleSubmit');
  }
  handleSubmit(e){
    e.preventDefault();
    var qNode = React.findDOMNode(this.refs.query);
    var query = qNode.value.trim();
    this.props.handleSubmit(query);
    qNode.value = '';
    return;
  }
  render(){
    return (
      <form className="searchForm" onSubmit={this.handleSubmit}>
        <input className="searchInput" type="text" placeholder="Enter a name..." ref="query" />
        <input className="searchSubmit" type="submit" value="Search"/>
      </form>
    );
  }
}

module.exports = SearchForm;
