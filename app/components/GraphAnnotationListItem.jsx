import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

export default class GraphAnnotationListItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleDragStart', '_handleDragEnd');
  }

  render() {
    let active = this.props.currentIndex == this.props.index;

    return (
      <li
        className={active ? "oligrapherAnnotationListItem active" : "oligrapherAnnotationListItem"} 
        draggable={true}
        onClick={this._handleClick}
        onDragStart={this._handleDragStart}
        onDragEnd={this._handleDragEnd}>
        {this.props.annotation.header}
      </li>
    );
  }

  _handleDragStart() {

  }

  _handleDragEnd() {
    
  }

  _handleClick() {
    this.props.show(this.props.index);
  }
}