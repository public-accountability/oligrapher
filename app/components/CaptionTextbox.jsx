import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

export const styleForCaption = (caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + 'px',
    fontWeight: caption.weight,
    height: caption.height + 'px',
    width: caption.width + 'px'
  }
}

export default function CaptionTextbox({ caption, status }) {
  const style = styleForCaption(caption)
  const editMode = useSelector(state => state.display.modes.editor)
  const className = `caption-text caption-text-${status}` 
    + (editMode ? ' editing' : '')

  return (
    <div
      xmlns="http://www.w3.org/1999/xhtml"
      className={className}
      style={style}>
      { caption.text }
    </div>
  )
}

CaptionTextbox.propTypes = {
  caption: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
}
