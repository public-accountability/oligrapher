import React, { Component, PropTypes } from 'react';
import EmbeddedNavBar from './EmbeddedNavBar';
import EmbeddedGraphAnnotation from './EmbeddedGraphAnnotation';
import { pxStr } from '../helpers';

export default class EmbeddedGraphAnnotations extends Component {
  render () {
    let hasTracker = this.props.annotationCount > 1;
    let { logoUrl, annotationHeight, linkUrl, linkText, logoWidth } = this.props.embedded;

    let imgStyle = {
      position: 'absolute',
      bottom: 10,
      right: 0,
      marginRight: '5px',
      maxWidth: logoWidth
    };
    
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
	  
	  <div className="col-sm-12">
	    <EmbeddedGraphAnnotation annotation={this.props.annotation} embedded={this.props.embedded} hasTracker={hasTracker} />
	  </div>

	  { (logoUrl || (linkUrl && linkText) ) && 
	    <div style={{position: 'relative', height: '100%', pointerEvents: 'none' }}>  
	       { linkUrl && linkText &&
		<div style={{position: 'absolute', bottom: 0, paddingLeft: '15px', pointerEvents: 'auto' }}>
		    <p><a href={linkUrl}>{linkText}</a></p>
		</div> }
	       { logoUrl && 
		 <img src={logoUrl} className="img-responsive" alt="Oligrapher Logo" style={imgStyle} />  }
	    </div> }
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
