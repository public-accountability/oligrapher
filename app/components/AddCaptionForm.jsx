import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { HotKeys } from 'react-hotkeys';

export default class AddCaptionForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSubmit', '_handleScaleChange');

    this.state = {
      scaleValue: 1
    };
  }

  render() {

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

    return (
      <div id="addCaption" className="form-inline buttonGroup">
        <form onSubmit={this._handleSubmit}>
          <input type="text" className="form-control input-sm" title="add caption" placeholder="add caption" ref="text" />
          &nbsp;<select 
            title="text size for new caption"
            value={this.state.scale} 
            className="form-control input-sm" 
            ref="scale" 
            onChange={this._handleScaleChange}>
            { scales.map((scale, i) =>
              <option key={scale[1]} value={scale[0]}>{scale[1]}</option>
            ) }
            </select>
        </form>
      </div>
    );
  }

  _handleScaleChange() {
    this.setState({scaleValue: this.refs.scale.value})
  }

  _handleSubmit(e) {
    let text = this.refs.text.value.trim();
    let scale = this.state.scaleValue;

    this.props.addCaption({ display: { text, scale  } });
    this._clear();
    e.preventDefault();
  }

  _clear() {
    this.refs.text.value = '';
    this.refs.scale.value = 1;
  }
}