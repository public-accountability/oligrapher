import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';
import times from 'lodash/times';

export default class AnnotationsTracker extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_circle');
  }

  render () {
    return (
      <div id="annotationsTracker">
	  { times(this.props.annotationCount, this._circle)  }
      </div>
    )
  }
  
  _circle (i) {
    if (i === this.props.currentIndex) {
      return (<div key={i.toString()} className="tracker-circle tracker-circle-selected"></div>);
    } else {
      return (<div key={i.toString()} className="tracker-circle"></div>);
    }
  }

}

AnnotationsTracker.propTypes = {
  annotationCount: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired
}
