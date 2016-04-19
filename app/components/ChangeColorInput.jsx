import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { CompactPicker } from 'react-color';

export default class ChangeColorInput extends BaseComponent {

  constructor() {
    super();
    this.state = {
      displayColorPicker: false,
      color: "#cccccc"
 	 },
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  }

  handleClose() {
    this.setState({ displayColorPicker: false });
  }

  handleClearClick() {
  	this.handleClose();
  	this.onChange("#cccccc");
  }

  handleValueChange(color) {
    this.onChange("#" + color.hex);
  }

  onChange(newColor) {
  	this.setState({ color: newColor });
    this.props.parent.apply(newColor);
  }

  render() {
    return (

      <div id= "nodeColorInputWrapper">
	      <div id="swatch"  className="input-sm form-control">
	         <div id="color" style={{background: this.state.color }} onClick={ this.handleClick }/>
	         <button id="nodeColorInputClearer" onClick={ () => this.handleClearClick() }>
	         	<span className="glyphicon glyphicon-remove-sign"></span>
	         </button>
	      </div>
	      <div id= "nodeColorPickerWrapper">
	          { this.state.displayColorPicker ? <div is="popover">
	          <div is="cover" onClick={ this.handleClose }/>
	          <CompactPicker color={ this.state.color }  onChange={ this.handleValueChange } />
	        </div> : null }
	      </div>
      </div>
    );
  }
};