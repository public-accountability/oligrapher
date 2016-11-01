import React, { Component, PropTypes } from 'react';
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
                <div className="arrow-node-name" style={{marginLeft: '-10px'}}>
                    {this._nodeCircle(node1_name)}
                </div>
                <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="left" arrow={arrow} />
                <EdgeDashSelector isDashed={Boolean(this.props.dash)} updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} />
                <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="right" arrow={arrow} />
                <div className="arrow-node-name">
                    {this._nodeCircle(node2_name)}
                </div>
            </div>
        );
    }


    _nodeCircle(nodeName) {
        return (
                <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="80px" height="50px" preserveAspectRatio="xMidYMid">
                    <circle cx="50%" cy="50%" r="20" fill="#ccc"></circle>
                    <text x="40" y="50" fontSize="0.5em" textAnchor="middle">{nodeName}</text>
                </svg>
        );
    };
    
};

