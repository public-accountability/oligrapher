import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import EmbeddedNavButtons from './EmbeddedNavButtons';

export default class EmbeddedNavBar extends BaseComponent {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <EmbeddedNavButtons 
	  annotationCount={this.props.annotationCount}
      />
    )
  }
  
  
}

EmbeddedNavBar.propTypes = {
  currentIndex: PropTypes.number,
  annotationCount: PropTypes.number.isRequired
}
