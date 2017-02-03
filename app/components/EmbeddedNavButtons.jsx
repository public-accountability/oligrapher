import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";

export default class EmbeddedNavButtons extends BaseComponent {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div id="oligrapherNavButtonsEmbedded">
	  <button>Back</button>
	  <button>Next</button>
      </div>
    )
  }

  
}

EmbeddedNavButtons.propTypes = {
  currentIndex: PropTypes.number,
  annotationCount: PropTypes.number.isRequired
}
