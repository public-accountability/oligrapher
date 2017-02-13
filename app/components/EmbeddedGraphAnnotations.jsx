import React, { Component, PropTypes } from 'react';
import EmbeddedNavBar from './EmbeddedNavBar';
import EmbeddedGraphAnnotation from './EmbeddedGraphAnnotation';

export default class EmbeddedGraphAnnotations extends Component {
  render () {
    let hasTracker = this.props.annotationCount > 1;

    return (
      <div id="oligrapherEmbeddedGraphAnnotations"  className="row" style={{height: '100%'}} >
	  <div className="col-sm-12">
	    { hasTracker && 
		    <EmbeddedNavBar 
			annotationCount={this.props.annotationCount}
			currentIndex={this.props.currentIndex}
			prevClick={this.props.prevClick}
			nextClick={this.props.nextClick}
		    />
	    }
	  </div>
	  <div className="col-sm-10">
	    <EmbeddedGraphAnnotation annotation={this.props.annotation} embedded={this.props.embedded} hasTracker={hasTracker} />
	  </div>
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
