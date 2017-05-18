import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';

export default class GraphAnnotationList extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleClick', '_handleDragOver', '_handleDragStart', '_handleDragEnd');
    this._placeholder = document.createElement("li");
    this._placeholder.className = "placeholder";
  }

  render() {
    return (
      <div id="oligrapherAnnotationList">
        <ul id="oligrapherAnnotationListItems" onDragOver={this._handleDragOver}>
          { this.props.annotations.map((annotation, index) =>
            <li
              key={annotation.id}
              data-id={index}
              className={index == this.props.currentIndex ? "active" : null} 
              draggable={true}
              onClick={this._handleClick}
              onDragStart={this._handleDragStart}
              onDragEnd={this._handleDragEnd}>
              {annotation.header.trim().length > 0 ? annotation.header : "Untitled Annotation"}
            </li>              
          ) }
        </ul>
        { this.props.isEditor ? 
          <button 
            title="add annotation"
            id="oligrapherCreateGraphAnnotationButton"
            className="btn btn-sm btn-default" 
            onClick={this.props.create}>
            New Annotation
          </button> : null }
      </div>
    );
  }

  _handleClick(e) {
    this.props.show(parseInt(e.target.dataset.id));

    if (this.props.isEditor) { 
      this.props.hideEditTools();
    };
  }

  _handleDragStart(e) {
    this._startY = e.clientY;
    this._dragged = e.currentTarget;
    this._placeholder.innerHTML = e.currentTarget.innerHTML;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget);
  }

  _handleDragEnd(e) {
    this._dragged.style.display = "block";
    this._dragged.parentNode.removeChild(this._placeholder);

    // update store
    let from = Number(this._dragged.dataset.id);
    let to = Number(this._over.dataset.id);

    this.props.move(from, to);

    this._startY = undefined;
  }

  _handleDragOver(e) {
    e.preventDefault();

    let thisHeight = this._dragged.offsetHeight;
    this._dragged.style.display = "none";

    if (e.target.className == "placeholder") return;

    this._over = e.target;

    let relY = e.clientY - this._startY;
    let height = (this._over.offsetHeight || thisHeight) / 2;
    let parent = e.target.parentNode;

    if (relY > height) {
      parent.insertBefore(this._placeholder, e.target.nextElementSibling);
    }
    else if (relY < height) {
      parent.insertBefore(this._placeholder, e.target);
    } 
  }
}