import React, { Component } from 'react';
import BaseComponent from './BaseComponent';
import { legacyArrowConverter } from '../helpers';
import EdgeArrowSelector from './EdgeArrowSelector';
import EdgeDashSelector from './EdgeDashSelector';
import NodeLabel from './NodeLabel';

export default class EdgeDropdown extends Component {
    
  render() {
    const graph = this.props.getGraph();
    const edge = graph.edges[this.props.edgeId];
    const node1_name = graph.nodes[edge.node1_id].display.name;
    const node2_name = graph.nodes[edge.node2_id].display.name;
    const arrow = this.props.arrow;
    
    return (
  	  <div className="strokeDropdowns">
            <div className="arrow-node-name">
              {this._nodeCircle(this._truncateName(node1_name))}
            </div>
            <div style={{position: 'relative', zIndex: '100'}}>
            <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="left" arrow={arrow} />
            <EdgeDashSelector isDashed={Boolean(this.props.dash)} updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} />
            <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="right" arrow={arrow} />
            </div>
            <div className="arrow-node-name">
              {this._nodeCircle(this._truncateName(node2_name))}
            </div>
          </div>
        );
    }

    _nodeCircle(nodeName) {
        return (
                <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="140px" height="60px" preserveAspectRatio="xMidYMid">
                  <rect fill="white" x="0" y="40" height="12px" width="140px" fillOpacity="0.7"></rect>                   
                 <circle cx="50%" cy="40%" r="18" fill="#ccc"></circle>
                  <text x="70" y="50" fontSize="0.5em" textAnchor="middle">{nodeName}</text>
                </svg>
        );
    };

  _truncateName(name) {
    if (name.length > 33) {
      return `${name.slice(0,30)}...`;
    } else {
      return name;
    }
   }
    
}

