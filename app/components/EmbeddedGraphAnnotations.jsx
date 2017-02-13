import React, { Component, PropTypes } from 'react';
import EmbeddedNavBar from './EmbeddedNavBar';
import EmbeddedGraphAnnotation from './EmbeddedGraphAnnotation';
import { pxStr } from '../helpers';

const TRACKER_OFFSET = 30;

export default class EmbeddedGraphAnnotations extends Component {
  render () {
    let hasTracker = this.props.annotationCount > 1;
    let { logoUrl, annotationHeight } = this.props.embedded;
    let imgContainerHeight = annotationHeight - 15 - (hasTracker ? TRACKER_OFFSET : 0);
    
    return (
      <div id="oligrapherEmbeddedGraphAnnotations"  className="row" style={{height: '100%'}} >
	  <div className="col-sm-12">
	    { hasTracker && 
		    <EmbeddedNavBar 
			annotationCount={this.props.annotationCount}
			currentIndex={this.props.currentIndex}
			prevClick={this.props.prevClick}
			nextClick={this.props.nextClick}
		    /> }
	  </div>
	  
	  <div className="col-sm-10">
	    <EmbeddedGraphAnnotation annotation={this.props.annotation} embedded={this.props.embedded} hasTracker={hasTracker} />
	  </div>
	  
	  { logoUrl && 
	    <div className="col-sm-2" style={{height: pxStr(imgContainerHeight) }} >
		<div style={{position:'relative', height: '100%'}}>
		    <img 
			src={logoUrl} 
			className="img-responsive" 
			alt="Oligrapher Logo" 
			style={{position: 'absolute', bottom: 0}}
		    />
		</div>
	    </div>
	  }
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
