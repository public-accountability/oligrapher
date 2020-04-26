import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import { callWithTargetValue } from '../util/helpers'
import { styleForCaption } from '../components/graph/CaptionTextbox'

export default function EditCaptionTextarea({ caption, updateCaption }) {
  const textareaRef = useRef()
  const onChange = callWithTargetValue(text => updateCaption({ text }))

  // user can resize textarea and its size is 
  // applied to the caption when closed
  useEffect(() => {
    const node = textareaRef.current

    return () => {
      const { width, height } = node.getBoundingClientRect()
      updateCaption({ width: Math.round(width), height: Math.round(height) })
    }
  }, [caption, updateCaption])

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