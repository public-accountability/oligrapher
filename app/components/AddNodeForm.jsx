import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import AddNodeResult from './AddNodeResult';
import { HotKeys } from 'react-hotkeys';

export default class AddNodeForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSubmit', '_handleSearch');
  }

  render() {
    const keyMap = { 
      'altN': ['alt+n', 'ctrl+n'],
      'esc': 'esc'
    };

    const keyHandlers = {
      'altN': () => this.props.closeAddForm(),
      'esc': () => this.props.closeAddForm()
    };

    // filter existing nodes out of results
    const results = this.props.results.filter(node => !this.props.nodes[node.id]);

    return (
      <div id="addNode" className="editForm">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <h3>Add Node</h3>
          <form onSubmit={this._handleSubmit}>
            <input autoFocus type="text" placeholder="name" ref="name" onChange={this._handleSearch} /><br />
            <button type="submit">Add</button>
            { this.props.source && results.length > 0 ? 
              <div className="addNodeResults">
                or import from {this.props.source.name}: &nbsp;
                { results.map((node, i) =>
                    <AddNodeResult 
                      key={node.id} 
                      node={node} 
                      source={this.props.source} 
                      nodes={this.props.nodes} 
                      addNode={this.props.addNode}
                      addEdge={this.props.addEdge} />
                  ) }
              </div> : null }
          </form>
        </HotKeys>
      </div>
    );
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  _handleSubmit(e) {
    let name = this.refs.name.value.trim();
    this.props.addNode({ display: { name } });
    this._clear();
    this.props.closeAddForm();
    e.preventDefault();
  }

  _handleSearch() {
    // text and source required for search
    if (this.props.source) {
      let that = this;

      // cancel previously queued search
      window.clearTimeout(this.timeout);

      // queue new search
      this.timeout = setTimeout(() => {
        let query = that.refs.name.value.trim();

        if (query) {
          that.props.source.findNodes(query, nodes => that._addResults(nodes));          
        }
      }, 200);
    }
  }

  _addResults(nodes) {
    this.props.setNodeResults(nodes);
  }

  _clear() {
    this.refs.name.value = '';
  }
}