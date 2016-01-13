import React, { Component, PropTypes } from 'react';
import GraphNavButtons from './GraphNavButtons';
import GraphAnnotationList from './GraphAnnotationList';
import GraphAnnotation from './GraphAnnotation';
import GraphAnnotationForm from './GraphAnnotationForm';
require('../styles/oligrapher.annotations.css');

export default class GraphAnnotations extends Component {

  render() {
    let { prevClick, nextClick, isEditor, editForm, navList, 
          swapAnnotations, annotation, currentIndex, 
          update, remove, swapEditForm, annotations, show, 
          create, move } = this.props;

    let navComponent = (
      <GraphNavButtons 
        prevClick={prevClick} 
        nextClick={nextClick} 
        isEditor={isEditor}
        swapAnnotations={swapAnnotations} />
    );

    let formComponent = (
      <GraphAnnotationForm 
        annotation={annotation} 
        index={currentIndex} 
        update={update} 
        remove={remove}
        swapEditForm={swapEditForm} />
    );

    let annotationComponent = (
      <GraphAnnotation 
        annotation={annotation} 
        index={currentIndex} 
        isEditor={isEditor}
        swapEditForm={swapEditForm} />
    );

    let navListComponent = (
      <GraphAnnotationList
        currentIndex={currentIndex}
        annotations={annotations}
        isEditor={isEditor}
        show={show} 
        create={create}
        move={move} 
        hideEditTools={this.props.hideEditTools} />
    );

    return (
      <div id="oligrapherGraphAnnotations" className="col-md-4">
        { annotation || isEditor ? navComponent : null }
        { isEditor && navList ? navListComponent : null }
        { annotation ? (isEditor ? formComponent : annotationComponent) : null }
      </div>
    );
  }
}