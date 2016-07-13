import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import mapKeys from 'lodash/object/mapKeys';

export default class DeleteSelectedButton extends BaseComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const whichClass = this.props.currentForm === "UpdateNodeForm" ? "nodeDelete" : "edgeDelete";

    return (
      <div 
        className = {"editForm form-inline " + whichClass}
        id = "deleteSelected">
        <button
          className="btn btn-sm btn-default"
          title="delete selected"
          onClick = {this.props.doDelete}>
          Delete Selected
        </button>
      </div>
    );
  }

}
