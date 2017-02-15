import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";

export default class EmbeddedNavButtons extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_isBackButtonDisabled', '_nextButtonClass');
  }
  render () {
    return (
      <div id="oligrapherNavButtonsEmbedded">
	    <button
		disabled={this._isBackButtonDisabled()}
		title="previous annotation"
		onClick={this.props.prevClick} 
		className="btn btn-sm btn-default btn-annotation-back">Back</button> 

	    <button
		title="next annotation"
		onClick={this.props.nextClick}
		className={`btn btn-sm btn-primary btn-annotation-next ${this._nextButtonClass()}`} >Next</button> 
      </div>
    )
  }

  _isBackButtonDisabled() {
    return this.props.currentIndex === 0;
  }
  
  _nextButtonClass() {
    if ( (this.props.currentIndex + 1) === this.props.annotationCount) {
      return 'invisible';
    } else {
      return '';
    }
  }

}

EmbeddedNavButtons.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  annotationCount: PropTypes.number.isRequired,
  nextClick: PropTypes.func.isRequired,
  prevClick: PropTypes.func.isRequired
}
