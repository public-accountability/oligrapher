import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy'; 
import merge from 'lodash/object/merge';

export default class UpdateEdgeForm extends BaseComponent {

  render() {
    let { display } = this.props.data;

    const keyMap = { 
      'esc': 'esc'
    };

    const keyHandlers = {
      'esc': () => this.props.deselect()
    };

    const scales = [
      [null, "Scale"],
      [1, "1x"],
      [1.5, "1.5x"],
      [2, "2x"],
      [3, "3x"]
    ];

    return (
      <div className="editForm updateForm form-inline">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <div>
            <input 
              type="checkbox" 
              ref="arrow" 
              checked={display.arrow} 
              onChange={() => this.apply()} /> arrow
            &nbsp;&nbsp;<input 
              type="checkbox" 
              ref="dash" 
              checked={display.dash} 
              onChange={() => this.apply()} /> dash
            &nbsp;&nbsp;<input 
              type="text" 
              className="form-control input-sm"
              placeholder="label" 
              ref="label" 
              value={display.label} 
              onChange={() => this.apply()} />
            &nbsp;<select 
              value={display.scale} 
              className="form-control input-sm" 
              ref="scale" 
              onChange={() => this.apply()}>
              { scales.map((scale, i) =>
                <option key={scale[1]} value={scale[0]}>{scale[1]}</option>
              ) }
            </select>
          </div>
          <div>
            <input
              id="edgeUrlInput"
              className="form-control input-sm"
              type="text"
              ref="url"
              placeholder="link URL"
              value={display.url}
              onChange={() => this.apply()} />
          </div>
        </HotKeys>
      </div>
    );
  }

  apply() {
    if (this.props.data) {
      let label = this.refs.label.value;
      let arrow = this.refs.arrow.checked;
      let dash = this.refs.dash.checked;
      let scale = parseFloat(this.refs.scale.value);
      let url = this.refs.url.value.trim();
      this.props.updateEdge(this.props.data.id, { display: { label, arrow, dash, scale, url } });
    }
  }
}