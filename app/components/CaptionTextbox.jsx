import React from 'react'
import PropTypes from 'prop-types'

export const styleForCaption = (caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + 'px',
    fontWeight: caption.weight,
    height: caption.height + 'px',
    width: caption.width + 'px'
  }
}

export default function CaptionTextbox({ caption }) {
  const style = styleForCaption(caption)

  return (
    <div 
      className="caption-text"
      style={style}>
      { caption.text }
    </div>
  )
}

CaptionTextbox.propTypes = {
  caption: PropTypes.object.isRequired
}
