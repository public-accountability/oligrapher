import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";
import EmbeddedNavBar from './EmbeddedNavBar';

export default class EmbeddedGraphAnnotations extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="row">
	  <EmbeddedNavBar 
	      annotationCount={this.props.annotationCount}
	  />
      </div>
    )
  }
}

EmbeddedGraphAnnotations.propTypes = {
  annotationCount: PropTypes.number
}
