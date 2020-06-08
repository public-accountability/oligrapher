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

export default function CaptionTextbox({ caption, highlighted }) {
  const style = styleForCaption(caption)
  const className = "caption-text" + (highlighted ? " caption-text-highlighted" : "")

  return (
    <div 
      className={className}
      style={style}>
      { caption.text }
    </div>
  )
}

CaptionTextbox.propTypes = {
  caption: PropTypes.object.isRequired,
  highlighted: PropTypes.bool.isRequired
}
