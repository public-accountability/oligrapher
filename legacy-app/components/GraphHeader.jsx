import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GraphTitle from './GraphTitle';
import GraphTitleForm from './GraphTitleForm';
import GraphByLine from './GraphByLine';
import GraphLinks from './GraphLinks';


export default class GraphHeader extends Component {

  render() {
    let { user, date, links, title, isEditor, updateTitle, url, isEmbedded, embedded } = this.props;
    
  return (
      <div id="oligrapherHeader"
	   style={ isEmbedded ? {height: embedded.headerSize} : {} } >
          { isEditor ?
            <GraphTitleForm title={title} updateTitle={updateTitle} /> :
            <GraphTitle title={title} url={url} isEmbedded={isEmbedded} embedded={embedded} /> }
        { (!isEmbedded && (user || date)) ? <GraphByLine user={user} date={date} /> : null }
        { (links && !isEmbedded) ? <GraphLinks links={links} /> : null }
	  
      </div>
    );
  }
}
