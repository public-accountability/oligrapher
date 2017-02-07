import React, { Component, PropTypes } from 'react';

export default class GraphTitle extends Component {

  render() {
    let h1Style = Boolean(this.props.isEmbedded) ? {fontSize: this.props.embedded.headerFontSize } : {};
    return (
      <h1 id="oligrapherTitle" style={h1Style} >{ this.props.url ? <a href={this.props.url} target="_blank">{this.props.title}</a> : this.props.title }</h1>
    );
  }
}

GraphTitle.PropTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  isEmbedded: PropTypes.boolean,
  embedded: PropTypes.object
}
