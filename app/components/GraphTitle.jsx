import React, { Component, PropTypes } from 'react';

export default class GraphTitle extends Component {

  render() {
    return (
      <h1 id="oligrapherTitle">{ this.props.url ? <a href={this.props.url} target="_blank">{this.props.title}</a> : this.props.title }</h1>
    );
  }
}