import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import mapKeys from 'lodash/object/mapKeys';

export default class AddConnectedNodesForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSubmit');
  }

  render() {
    const keyMap = { 
      'esc': 'esc'
    };

    const keyHandlers = {
      'esc': () => this.props.closeAddForm()
    };

    return (
      <div id="addConnectedNodes" className="editForm form-inline">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>  
          <input 
            id="addConnectedNodesNum" 
            type="text" 
            title="maximum number of nodes to add"
            className="form-control input-sm" 
            defaultValue="5" 
            ref="num" />
          { this._renderOptions() }
          &nbsp;<button onClick={this._handleSubmit} title="search for given number of nodes" className="btn btn-sm btn-default">Add Connections</button>
        </HotKeys>
      </div>
    );
  }

  _renderOptions() {
    let options = this.props.source.getConnectedNodesOptions;
    return options ? Object.keys(options).map(key => {
      return (<select key={key} title="type of connections to search for" className="form-control input-sm" ref={key}>
        { Object.keys(options[key]).map(val => {
          return <option key={val} value={val}>{options[key][val]}</option>
        }) }
      </select>);
    }) : null;
  }

  _handleSubmit(e) {
    let num = parseInt(this.refs.num.value);
    let nodeId = this.props.data.id;
    let nodeIds = Object.keys(this.props.graph.nodes);
    let options = this._options();

    this.props.source.getConnectedNodes(nodeId, nodeIds, options, (data) => {
      this.props.addSurroundingNodes(nodeId, data.nodes);

      data.edges.forEach(edge => {
        if (!this.props.graph.edges[edge.id]) {
          this.props.addEdge(edge);
        }
      });
    });

    e.preventDefault();
  }

  _options() {
    return Object.keys(this.refs).reduce((result, ref) => {
      result[ref] = this.refs[ref].value;
      return result;
    }, {});
  }

  _clear() {
    this.refs.num.value = "5";
    Object.keys(this.props.source.getConnectedNodesOptions).forEach(key => { 
      this.refs[key].value = null
    });
  }
}