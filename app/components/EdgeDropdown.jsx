import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { legacyArrowConverter } from '../helpers';
import EdgeArrowSelector from './EdgeArrowSelector';
import EdgeDashSelector from './EdgeDashSelector';

export default class EdgeDropdown extends Component {
  render () {
      const arrow = legacyArrowConverter(this.props.arrow);
      return (
  	  <div className="strokeDropdowns">
	    <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="left" arrow={arrow} />
	    <EdgeDashSelector isDashed={Boolean(this.props.dash)} updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} />
            <EdgeArrowSelector updateEdge={this.props.updateEdge} edgeId={this.props.edgeId} arrowSide="right" arrow={arrow} />
	  </div>
      );
  }
};

