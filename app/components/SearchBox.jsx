const BaseComponent = require('./BaseComponent');
const Marty = require('marty');
const { Combobox, configure } = require('react-widgets');
configure.setGlobalizeInstance(window.globalize)
const lsApi = require('../api/lsApi');

class SearchBox extends BaseComponent {
  constructor(options){
    super(options);
    this.colors = ['red', 'white', 'blu'];
    this.state = { value: this.colors[0] };
    this.bindAll('search');
  }
  render(){
    return (
      <Combobox
        className="searchBox"
        data={this.colors}
        defaultValue='Search...'
        onSubmit={ value => this.setState({ value })}
      />
    );
  }
  search(query){
    lsApi.searchEntities(query)
      .then(res => this.setState({results: res}))
      .catch(err => {
        console.error(`Search produced an error: ${err}`);
        this.setState({results: ['Try again...']});
      });
  }
}

module.exports = Marty.createContainer(SearchBox);
