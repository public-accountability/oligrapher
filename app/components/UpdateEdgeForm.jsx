import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import values from 'lodash/object/values';
import sortBy from 'lodash/collection/sortBy'; 
import merge from 'lodash/object/merge';

export default class UpdateEdgeForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_apply', '_handleLabelChange');
  }

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
      <div className="editForm form-inline">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <input 
            type="checkbox" 
            ref="arrow" 
            checked={display.arrow} 
            onChange={this._apply} /> arrow
          &nbsp;&nbsp;<input 
            type="checkbox" 
            ref="dash" 
            checked={display.dash} 
            onChange={this._apply} /> dash
          &nbsp;&nbsp;<input 
            type="text" 
            className="form-control input-sm"
            placeholder="label" 
            ref="label" 
            value={display.label} 
            onChange={this._handleLabelChange} />
          &nbsp;<select value={display.scale} className="form-control input-sm" ref="scale" onChange={this._apply}>
            { scales.map((scale, i) =>
              <option key={i} value={scale[0]}>{scale[1]}</option>
            ) }
          </select>
        </HotKeys>
      </div>
    );
  }

  _handleLabelChange(event) {
    this._apply();    
  }

  _apply() {
    if (this.props.data) {
      let label = this.refs.label.value.trim();
      let arrow = this.refs.arrow.checked;
      let dash = this.refs.dash.checked;
      let scale = parseFloat(this.refs.scale.value);
      this.props.updateEdge(this.props.data.id, { display: { label, arrow, dash, scale } });
    }
  }
}