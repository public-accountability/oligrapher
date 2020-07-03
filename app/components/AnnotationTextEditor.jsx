import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'ClassicEditor'

export default function AnnotationTextEditor({ text, onChange }) {  
  const cleanup = useCallback(string => (string === '' ? null : string), [])
  const handleChange = useCallback((event, editor) => { 
    onChange(cleanup(editor.getData()))
  }, [onChange, cleanup])

  const config = {
    placeholder: 'Annotation text',
    toolbar: [
      'bold', 'italic', 'link', 'bulletedList', 'numberedList',
      'blockQuote', 'undo', 'redo'
    ]
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={text}
      onChange={handleChange}
      config={config}
      />
  )
}

AnnotationTextEditor.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}