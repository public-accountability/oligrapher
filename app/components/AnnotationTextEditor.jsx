import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const nullifyIfEmpty = string => string === '' ? null : string

export default function AnnotationTextEditor({ text, onChange }) {
  const handleChange = useCallback((event, editor) => {
    onChange(nullifyIfEmpty(editor.getData()))
  }, [onChange])

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
      data={text || '<p></p>'}
      onChange={handleChange}
      config={config}
      />
  )
}

AnnotationTextEditor.propTypes = {
  text: PropTypes.string,
  onChange: PropTypes.func.isRequired
}
