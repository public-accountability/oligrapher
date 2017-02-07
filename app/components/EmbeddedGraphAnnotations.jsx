import React, { Component, PropTypes } from 'react';
import EmbeddedNavBar from './EmbeddedNavBar';
import EmbeddedGraphAnnotation from './EmbeddedGraphAnnotation';

export default class EmbeddedGraphAnnotations extends Component {
  render () {
    return (
      <div id="oligrapherEmbeddedGraphAnnotations" style={{height: this.props.embedded.annotationSize}} >
	  
	  <div className="row">
	      <div className="col-sm-12">
		  <EmbeddedNavBar 
		      annotationCount={this.props.annotationCount}
		      currentIndex={this.props.currentIndex}
		      prevClick={this.props.prevClick}
		      nextClick={this.props.nextClick}
		  />
	      </div>
	  </div> {/* end row */}
	  
	  <div className="row">
	      <div className="col-sm-12">
		  <EmbeddedGraphAnnotation annotation={this.props.annotation} />
	      </div>
	  </div> {/* end row */}

      </div>
    );
  }
}

EmbeddedGraphAnnotations.propTypes = {
  embedded: PropTypes.object,
  annotationCount: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  annotation: PropTypes.object,
  nextClick: PropTypes.func,
  prevClick: PropTypes.func
}
