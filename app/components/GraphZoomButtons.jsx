import React, { Component, PropTypes } from 'react';

export default class GraphZoomButtons extends Component {
  render(){
    return (
      <div id="zoomButtons">
        <button id="zoom-in" className="zoomButton" onClick={this.props.zoomIn}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
        <button id="zoom-out" className="zoomButton" onClick={this.props.zoomOut}>
          <span className="glyphicon glyphicon-minus"></span>
        </button>
      </div>
    );
  }
}