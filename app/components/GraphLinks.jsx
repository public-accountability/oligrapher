import React, { Component, PropTypes } from 'react';

export default class GraphLinks extends Component {

  render() {
    let { links } = this.props;

    return (
      <div id="oligrapherGraphLinks" style={{ display: "inline-block" }}>
        { links.map((link, i) => {
          return (link.method == "POST" ? this._postLink(link, i) : this._getLink(link, i));
        }) }
      </div>
    );
  }

  _getLink(link, i) {
    return <a key={i} id={link.id} href={link.url} target={link.target}>{link.text}</a>;
  }

  _postLink(link, i) {
    return (
      <form key={i} action={link.url} method="POST">
        <input type="hidden" name="foo" value="bar" />
        <a id={link.id} onClick={e => e.target.parentElement.submit()}>{link.text}</a>
      </form>
    );
  }

  _renderUser(user) {
    return (
      <span>by { user.url ? <a id="oligrapherUser" href={user.url} target="_blank">{user.name}</a> : <span id="oligrapherUser">{user.name}</span> }&nbsp;&nbsp;</span>
    );
  }
}