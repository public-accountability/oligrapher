import React, { Component, PropTypes } from 'react';
import GraphZoomButtons from './GraphZoomButtons';
import Graph from './Graph';

export default class GraphContainer extends Component {
  render(){
    return (
      <div className="graphContainer">
        <GraphZoomButtons />
        <Graph graph={this.props.graph} />
      </div>
    );
  }
}


