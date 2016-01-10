import React, { Component, PropTypes } from 'react';

export default class ZoomButtons extends Component {

  render() {
    return (
      <div id="zoomButtons">
        <button id="zoomIn" onClick={this.props.zoomIn}>+</button>
        <button id="zoomOut" onClick={this.props.zoomOut}>&ndash;</button>   
      </div>
    );
  }
}