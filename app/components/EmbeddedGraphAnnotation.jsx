import React, { Component, PropTypes } from 'react';
import BaseComponent from "./BaseComponent";

export default class EmbeddedGraphAnnotation extends BaseComponent {
  constructor(props) {
    super(props);
    /* this.bindAll('_annotation');*/
  }

  render() {
    return (<span>{this.props.annotation.header}</span>);
  }

}

EmbeddedGraphAnnotation.propTypes = {
  annotation: PropTypes.object
}
