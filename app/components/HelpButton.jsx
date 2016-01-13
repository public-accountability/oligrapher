import React, { Component, PropTypes } from 'react';

export default class HelpButton extends Component {

  render() {
    return (
      <button 
        id="oligrapherHelpButton" 
        className="btn btn-sm btn-default"
        title="show user guide"
        onClick={this.props.toggleHelpScreen}>
        <span className="glyphicon glyphicon-question-sign"></span>
      </button>
    );
  }
}
