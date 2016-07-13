import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import merge from 'lodash/object/merge';

export default class UpdateCaptionForm extends BaseComponent {

  render() {
    let { display } = this.props.data;

    const scales = [
      [null, "Scale"],
      [1, "1x"],
      [1.25, "1.25x"],
      [1.5, "1.5x"],
      [2, "2x"],
      [2.5, "2.5x"],
      [3, "3x"],
      [4, "4x"],
      [5, "5x"]
    ];

    const keyMap = { 
      'esc': 'esc',
      'enter': 'enter'
    };

    const keyHandlers = {
      'esc': () => this.props.deselect(),
      'enter': () => this.props.deselect()    
    };

    return (

      <div className="form-inline buttonGroup">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <input 
              type="text"
              className="form-control input-sm"
              placeholder="text" 
              ref="text" 
              value={display.text} 
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
        </HotKeys>
      </div>
    );
  }


  apply() {
    if (this.props.data) {
      let text = this.refs.text.value.trim();
      let scale = parseFloat(this.refs.scale.value);
      this.props.updateCaption(this.props.data.id, { display: { text, scale } });
    }
  }
}