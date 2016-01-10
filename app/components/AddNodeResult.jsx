import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

export default class AddNodeResult extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleClick');
  }

  render() {
    return (
      <li className="addNodeResult"><a onClick={this._handleClick}>{this.props.node.display.name}</a></li>
    );
  }

  _handleClick(e) {
    let { source, node, nodes } = this.props;

    if (source) {
      let nodeIds = Object.keys(nodes);

      let callback = (data) => {
        this.props.addNode(data.node);
        data.edges.forEach(edge => this.props.addEdge(edge));
        this.props.clearResults();
      };

      source.getNodeWithEdges(node.id, nodeIds, callback);
    }
  }
}

