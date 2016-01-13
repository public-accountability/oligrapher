import React, { Component, PropTypes } from 'react';

export default class GraphByLine extends Component {

  render() {
    let { user, date } = this.props;

    return (
      <div id="oligrapherByLine" style={{ display: "inline-block" }}>
        { user ? this._renderUser(user) : null }
        { date ? <span id="oligrapherDate">{date}</span> : null }
      </div>
    );
  }

  _renderUser(user) {
    return (
      <span>by { user.url ? <a id="oligrapherUser" href={user.url} target="_blank">{user.name}</a> : <span id="oligrapherUser">{user.name}</span> }&nbsp;&nbsp;</span>
    );
  }
}