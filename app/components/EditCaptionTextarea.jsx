import React, { useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import ReactResizeDetector from 'react-resize-detector'

import { styleForCaption } from './CaptionTextbox'

export default function EditCaptionTextarea({ caption, updateCaption, setForeignObjectSize }) {
  const textareaRef = useRef()

  const onResize = useCallback(() => {
    const { width, height } = textareaRef.current.style
    setForeignObjectSize({ width: parseInt(width) + 2, height: parseInt(height) + 2 })
  }, [setForeignObjectSize])
  
  useEffect(() => {
    let node = textareaRef.current

    if (caption.text === 'New Caption') {
      node.select()
    } else {
      node.focus()
    }

    // onResize()

    // save resize on close
    return () => {
      const { width, height } = node.style
      const text = node.value
      updateCaption({ text, width: parseInt(width), height: parseInt(height) })  
    }
  }, [caption, updateCaption, onResize])

  const style = styleForCaption(caption)

  return (
    <div>
      <textarea
        ref={textareaRef}
        className="edit-caption-textarea"
        defaultValue={caption.text}
        style={style}>
      </textarea>
      <ReactResizeDetector 
        handleWidth 
        handleHeight 
        querySelector=".edit-caption-textarea"
        onResize={onResize} 
        skipOnMount={true} />
    </div>
  )
}

EditCaptionTextarea.propTypes = {
  caption: PropTypes.object.isRequired,
  updateCaption: PropTypes.func.isRequired,
  setForeignObjectSize: PropTypes.func.isRequired
}