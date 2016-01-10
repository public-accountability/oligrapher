import React, { Component, PropTypes } from 'react';

export default class LayoutButtons extends Component {

  render() {
    return (
      <div id="layoutButtons" className="btn-group buttonGroup">
        <button className="btn btn-sm btn-default" onClick={this.props.prune}>prune</button>
        <button className="btn btn-sm btn-default" onClick={this.props.circleLayout}>circle</button>
        <button className="btn btn-sm btn-default" onClick={this.props.clearGraph}>clear</button>
      </div>
    );
  }
}