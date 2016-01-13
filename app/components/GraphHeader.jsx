import React, { Component, PropTypes } from 'react';
import GraphTitle from './GraphTitle';
import GraphTitleForm from './GraphTitleForm';
import GraphByLine from './GraphByLine';
import GraphLinks from './GraphLinks';

export default class GraphHeader extends Component {

  render() {
    let { user, date, links, title, isEditor, updateTitle, url } = this.props;

    return (
      <div id="oligrapherHeader">
        { isEditor ? 
          <GraphTitleForm title={title} updateTitle={updateTitle} /> : 
          <GraphTitle title={title} url={url} /> }
        { user || date ? 
          <GraphByLine user={user} date={date} /> : null }
        { links ? 
          <GraphLinks links={links} /> : null}
      </div>

    );
  }
}