import React, { Component, PropTypes } from 'react';

export default class GraphTitle extends Component {

  render() {
    let h1Class = Boolean(this.props.isEmbedded) ? 'embeddedTitle' : '';
    return (
      <h1 id="oligrapherTitle" className={h1Class}>{ this.props.url ? <a href={this.props.url} target="_blank">{this.props.title}</a> : this.props.title }</h1>
    );
  }
}

GraphTitle.PropTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  isEmbedded: PropTypes.boolean
}
