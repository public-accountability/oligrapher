import React, { Component, PropTypes } from 'react';

export default class GraphNavButtons extends Component {

  render() {
    var shouldShowNav = this.props.isEditor || this.props.annotations.length > 1;

    return (
      <div id="oligrapherNavButtons">
      { shouldShowNav && 
          <div id="oligrapherAnnotationsNavHolder">
            <button 
              title="previous annotation"
              className="btn btn-lg btn-default" 
              onClick={this.props.prevClick} 
              disabled={!this.props.canClickPrev}>Prev</button>
            <button 
              title="next annotation"
              className="clickplz btn btn-lg btn-default" 
              onClick={this.props.nextClick} 
              disabled={!this.props.canClickNext}>Next</button>
          </div>
      }
        <div style={{ float: "right" }}>
          <button
            title="show/hide annotations"
            id="oligrapherHideAnnotationsButton"
            className="btn btn-lg btn-default"
            onClick={this.props.swapAnnotations}>
            <span className="glyphicon glyphicon-font"></span>
          </button>
        </div>
      </div>
    );
  }
}