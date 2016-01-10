import React, { Component, PropTypes } from 'react';

export default class UndoButtons extends Component {

  render() {
    return (
      <div id="undobuttons" className="btn-group buttonGroup">
        <button className="btn btn-sm btn-default" onClick={this.props.undo} disabled={!this.props.canUndo}>undo</button>
        <button className="btn btn-sm btn-default" onClick={this.props.redo} disabled={!this.props.canRedo}>redo</button>
      </div>
    );
  }
}