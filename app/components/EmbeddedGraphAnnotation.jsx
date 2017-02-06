import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";

export default class EmbeddedGraphAnnotation extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let { header, text } = this.props.annotation;
    
    return (
      <div id="oligrapherEmbeddedGraphAnnotation">
	  <h3>{header}</h3>
	  <div id="oligrapherEmbeddedGraphAnnotationText"
	       dangerouslySetInnerHTML={{ __html: this.props.annotation.text }}>
	  </div>
      </div>
      
    );
  }

}

EmbeddedGraphAnnotation.propTypes = {
  annotation: PropTypes.object
}
