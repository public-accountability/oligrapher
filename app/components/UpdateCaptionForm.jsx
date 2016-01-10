import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';
import merge from 'lodash/object/merge';

export default class UpdateCaptionForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_apply', '_handleTextChange');
    this.state = this.props.data.display;
  }

  render() {
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
            type="text" 
            className="form-control input-sm"
            placeholder="name" 
            ref="text" 
            value={this.state.text} 
            onChange={this._handleTextChange} />
          &nbsp;<select value={this.state.scale} className="form-control input-sm" ref="scale" onChange={this._apply}>
            { scales.map((scale, i) =>
              <option key={i} value={scale[0]}>{scale[1]}</option>
            ) }
          </select>
        </HotKeys>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState(merge({}, { text: null, scale: null }, nextProps.data.display));
  }

  _handleTextChange(event) {
    this.setState({ text: event.target.value });
    this._apply();
  }

  _apply() {
    if (this.props.data) {
      let text = this.refs.text.value.trim();
      let scale = parseFloat(this.refs.scale.value);
      this.props.updateCaption(this.props.data.id, { display: { text, scale } });
    }
  }
}