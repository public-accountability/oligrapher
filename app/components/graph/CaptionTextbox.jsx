import React from 'react'
import PropTypes from 'prop-types'

export const styleForCaption = (caption) => {
  return {
    backgroundColor: '#ccc',
    fontFamily: caption.font,
    fontSize: caption.size + 'px',
    fontStyle: caption.style,
    height: caption.height + 'px',
    width: caption.width + 'px'
  }
}

export default function CaptionTextbox({ caption }) {
  const style = styleForCaption(caption)

  return (
    <div 
      xmlns="http://www.w3.org/1999/xhtml"
      className="caption-text"
      style={style}>
      { caption.text }
    </div>
  )
}

CaptionTextbox.propTypes = {
  caption: PropTypes.object.isRequired
}
