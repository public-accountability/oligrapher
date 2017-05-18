import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from "./BaseComponent";
import GraphNavButtons from './GraphNavButtons';
import GraphAnnotationList from './GraphAnnotationList';
import GraphAnnotation from './GraphAnnotation';
import GraphAnnotationForm from './GraphAnnotationForm';

export default class GraphAnnotations extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_remove', '_update');
  }

  render() {
    let { prevClick, nextClick, isEditor, editForm, navList, 
          swapAnnotations, annotation, currentIndex, 
          update, remove, swapEditForm, annotations, show, 
          create, move, canClickPrev, canClickNext } = this.props;

    let navComponent = (
      <GraphNavButtons {...this.props} />
    );

    let formComponent = (
      <GraphAnnotationForm 
        annotation={this.props.annotation}
        remove={this._remove} 
        update={this._update} />
    );
    
    let annotationComponent = (
      <GraphAnnotation {...this.props} />
    );

    let navListComponent = (
      <GraphAnnotationList {...this.props} />
    );

    return (
      <div id="oligrapherGraphAnnotations">
        { (annotation || isEditor) && navComponent }
        { isEditor && navList && navListComponent }
        { annotation && (isEditor ? formComponent : annotationComponent) }
      </div>
    );
  }

  _remove() {
    this.props.remove(this.props.currentIndex);
  }

  _update(data) {
    this.props.update(this.props.currentIndex, data);
  }
}
