import React, { Component, PropTypes } from 'react';
import titleize from 'titleize';

export default class GraphSettingsForm extends Component {

  render() {
    return (
      <div id="oligrapherSettingsForm">
        { Object.keys(this.props.settings).map(key => 
          <div key={key}>
            {titleize(key.replace(/[_-]+/, " "))}&nbsp;
            <input 
              ref={key}
              name={key}
              type="checkbox" 
              checked={this.props.settings[key]} 
              onChange={(event) => this.handleChange(event)} />
          </div>
        ) }
      </div>
    );
  }

  handleChange(event) {
    let key = event.target.name;
    let value = event.target.checked;
    this.props.updateSettings({ [key]: value });
  }
}