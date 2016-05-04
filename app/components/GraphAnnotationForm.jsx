import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import merge from 'lodash/object/merge';
import pick from 'lodash/object/pick';
import Editor from 'react-medium-editor';

export default class GraphAnnotationForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleHeaderChange', '_handleTextChange', '_handleRemove');
  }

  render() {
    let editorOptions = { 
      toolbar: { buttons: [
        'bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote', 'unorderedlist', 'orderedlist'
      ] },
      targetBlank: true, 
      placeholder: { text: "annotation text" }
    }


    return (
      <div id="oligrapherGraphAnnotationForm">
        <textarea
          id="oligrapherGraphAnnotationFormHeader"
          ref="header"
          name="header"
          className="form-control input-lg" 
          placeholder="annotation header"
          value={this.props.annotation.header}
          onChange={this._handleHeaderChange}></textarea>
        <Editor
          id="oligrapherGraphAnnotationFormText"
          name="text"
          ref="text"
          text={this.props.annotation.text}
          options={editorOptions}
          onChange={this._handleTextChange} />
        <button 
          className="btn btn-danger btn-sm" 
          onClick={this._handleRemove}>Remove</button>
      </div>
    );
  }

  _handleRemove() {
    if (confirm("Are you sure you want to delete this annotation?")) {
      this.props.remove();
    }
  }

  _handleHeaderChange() {
    this.props.update({ header: this.refs.header.value });
  }

  _handleTextChange(text) {
    this.props.update({ text });
  }
}