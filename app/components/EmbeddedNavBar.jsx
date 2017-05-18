import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';
import EmbeddedNavButtons from './EmbeddedNavButtons';
import AnnotationsTracker from './AnnotationsTracker';

export default class EmbeddedNavBar extends BaseComponent {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div id="embeddedNavBar">
        <EmbeddedNavButtons 
	      annotationCount={this.props.annotationCount}
	      currentIndex={this.props.currentIndex}
	      nextClick={this.props.nextClick}
	      prevClick={this.props.prevClick}  />
	<AnnotationsTracker 
          annotationCount={this.props.annotationCount}
          currentIndex={this.props.currentIndex}
        />
      </div>
    )
  }
  
}

EmbeddedNavBar.propTypes = {
  currentIndex: PropTypes.number,
  annotationCount: PropTypes.number.isRequired,
  nextClick: PropTypes.func.isRequired,
  prevClick: PropTypes.func.isRequired
}
