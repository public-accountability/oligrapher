import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class ZoomButtons extends Component {

  render() {
    return (
      <div id="zoomButtons">
        <button id="zoomIn" title="zoom in" onClick={this.props.zoomIn}>+</button>
        <button id="zoomOut" title="zoom out" onClick={this.props.zoomOut}>&ndash;</button>   
      </div>
    );
  }
}