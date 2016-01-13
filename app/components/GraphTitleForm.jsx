import React, { Component, PropTypes } from 'react';

export default class GraphTitleForm extends Component {

  render() {
    return (
      <h1 id="oligrapherTitle" className="oligrapherTitleInput">
        <input 
          ref="title"
          id="oligrapherTitleInput" 
          value={this.props.title}
          placeholder="title"
          onChange={(event) => this._handleChange(event)} />
      </h1>
    );
  }

  _handleChange(event) {
    let title = this.refs.title.value;
    this.props.updateTitle(title);
  }
}