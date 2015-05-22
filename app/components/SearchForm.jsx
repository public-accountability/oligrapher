var React = require('react');

class SearchForm extends React.Component {
  constructor() {
    super();
    this.displayName = 'SearchForm';
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e){
    e.preventDefault();
    var query = React.findDOMNode(this.refs.query).value.trim();
    this.props.handleSubmit(query);
    return;
  }
  render(){
    return (
      <form className="searchForm" onSubmit={this.handleSubmit} >
        <input className="searchInput" type="text" placeholder="Enter a name..." ref="query" />
        <input className="searchSubmit" type="submit" value="Search"/>
      </form>
    );
  }
}

module.exports = SearchForm;
