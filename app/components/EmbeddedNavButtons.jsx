import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";

export default class EmbeddedNavButtons extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_showBackButton', '_showNextButton');
  }
  render () {
    return (
      <div id="oligrapherNavButtonsEmbedded">
	  { this._showBackButton() && 
	    <button
		title="previous annotation"
		onClick={this.props.prevClick} 
		className="btn btn-default btn-annotation-back">Back</button> 
	  }
	  { this._showNextButton() &&
	    <button
		title="next annotation"
		onClick={this.props.nextClick} 
		className="btn btn-annotation-next">Next</button> 
	  }
      </div>
    )
  }

  _showBackButton() {
    return !(this.props.currentIndex === 0);
  }
  
  _showNextButton() {
    return !((this.props.currentIndex + 1) === this.props.annotationCount);
  }

  
}

EmbeddedNavButtons.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  annotationCount: PropTypes.number.isRequired,
  nextClick: PropTypes.func.isRequired,
  prevClick: PropTypes.func.isRequired
}
