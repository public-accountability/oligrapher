import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Octicon, { Gear } from '@githubprimer/octicons-react';

export default class SettingsButton extends Component {

  render() {
    return (
      <button 
        id="oligrapherSettingsButton" 
        className="btn btn-sm btn-default" 
        title="edit settings"
        onClick={() => this.props.toggleSettings()}>
        <Octicon icon={Gear} />
      </button>
    );
  }
}
