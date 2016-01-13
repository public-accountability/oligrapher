import React, { Component, PropTypes } from 'react';

export default class GraphAnnotation extends Component {

  render() {
    return (
      <div id="oligrapherGraphAnnotation">
        <h2>{this.props.annotation.header}</h2>
        <div 
          id="oligrapherGraphAnnotationText" 
          dangerouslySetInnerHTML={{ __html: this.props.annotation.text }}></div>
        { this.props.isEditor ? <button 
          id="oligrapherGraphAnnotationEditButton" 
          className="btn btn-default btn-sm" 
          onClick={this.props.swapEditForm}>Edit</button> : null }
        
      </div>
    );
  }
}