import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from './BaseComponent';
import AddNodeResult from './AddNodeResult';
import { HotKeys } from 'react-hotkeys';

export default class AddNodeInput extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSubmit', '_handleSearch');
  }

  render() {
    // filter existing nodes out of results
    const results = this.props.results.filter(node => !this.props.nodes[node.id]);

    const keyMap = { 
      'esc': 'esc'
    };

    const keyHandlers = {
      'esc': () => this.clear()
    };

    return (
      <div id="addNodeInput">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <form onSubmit={this._handleSubmit}>
            <input type="text" className="form-control input-sm" placeholder="add node" ref="name" onChange={this._handleSearch} /><br />
            { this.props.source ? 
              <ul className="addNodeResults dropdown-menu" style={{ display: results.length > 0 ? "block" : "none" }} ref="results">
                { results.map((node, i) =>
                  <AddNodeResult 
                    key={node.id}
                    node={node} 
                    source={this.props.source} 
                    nodes={this.props.nodes} 
                    addNode={this.props.addNode}
                    addEdge={this.props.addEdge}
                    clearResults={() => this.clear()} />
                  ) }
              </ul> : null }
          </form>
        </HotKeys>
      </div>
    );
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  clear() {
    this.refs.name.value = '';
    this.refs.name.blur();
    this.props.setNodeResults([]);
  }

  _handleSubmit(e) {
    let name = this.refs.name.value.trim();
    this.props.addNode({ display: { name } });
    this.clear();
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
        } else {
          this.setState({ results: [] })
        }
      }, 200);
    }
  }

  _addResults(nodes) {
    this.props.setNodeResults(nodes);
  }
}