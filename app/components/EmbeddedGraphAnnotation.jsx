import React, { Component, PropTypes } from 'react';

export default class EmbeddedGraphAnnotation extends Component {

  render() {
    let { header, text } = this.props.annotation;
    
    return (
      <div id="oligrapherEmbeddedGraphAnnotation">
	  <div className="row">
	      <h3>{header}</h3>
	      <div className="col-sm-8">
		  <div id="oligrapherEmbeddedGraphAnnotationText"
		       dangerouslySetInnerHTML={{ __html: this.props.annotation.text }}>
		  </div>
	      </div>
	  </div>
      </div>
      
    );
  }

}

EmbeddedGraphAnnotation.propTypes = {
  annotation: PropTypes.object
}
