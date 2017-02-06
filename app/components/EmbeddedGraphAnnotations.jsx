import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";
import EmbeddedNavBar from './EmbeddedNavBar';
import EmbeddedGraphAnnotation from './EmbeddedGraphAnnotation';

export default class EmbeddedGraphAnnotations extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="row">
	  <div className="col-sm-12">
	      <EmbeddedNavBar 
		  annotationCount={this.props.annotationCount}
		  currentIndex={this.props.currentIndex}
		  prevClick={this.props.prevClick}
		  nextClick={this.props.nextClick}
	      />
	  </div>
	  <div className="col-sm-12">
	      <EmbeddedGraphAnnotation annotation={this.props.annotation} />
	  </div>
      </div>
    )
  }
}

EmbeddedGraphAnnotations.propTypes = {
  annotationCount: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  annotation: PropTypes.object,
  nextClick: PropTypes.func,
  prevClick: PropTypes.func
}
