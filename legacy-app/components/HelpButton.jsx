import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Octicon, { Question } from '@githubprimer/octicons-react';

export default class HelpButton extends Component {

  render() {
    return (
      <button 
        id="oligrapherHelpButton" 
        className="btn btn-sm btn-default"
        title="show user guide"
        onClick={this.props.toggleHelpScreen}>
        <Octicon icon={Question}/>
      </button>
    );
  }
}
