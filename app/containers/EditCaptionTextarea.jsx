import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { callWithTargetValue } from '../util/helpers'
import { styleForCaption } from '../components/graph/CaptionTextbox'

export default function EditCaptionTextarea({ caption, updateCaption }) {
  const textareaRef = useRef()
  const svgZoom = useSelector(state => state.display.actualZoom / state.display.zoom)
  const onChange = callWithTargetValue(text => updateCaption({ text }))

  useEffect(() => {
    const node = textareaRef.current

    return () => {
      const { width, height } = node.getBoundingClientRect()
      updateCaption({ width: Math.round(width / svgZoom), height: Math.round(height / svgZoom) })
    }
  })

  const style = styleForCaption(caption)

  return (
    <textarea
      ref={textareaRef}
      xmlns="http://www.w3.org/1999/xhtml"
      className="edit-caption-textarea"
      value={caption.text}
      style={style}
      onChange={onChange}>
    </textarea>
  )
}

EditCaptionTextarea.propTypes = {
  caption: PropTypes.object.isRequired,
  updateCaption: PropTypes.func.isRequired
}