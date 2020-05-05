import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'

export default function EditorHeader({ title }) {
  const dispatch = useDispatch()
  const closeEditor = useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), [dispatch])

  return (
    <header className="editor-header">
      <div>{title}</div>
      <div>
        <button onClick={closeEditor}>
          <MdClose />
        </button>
      </div>
    </header>
  )
}

EditorHeader.propTypes = {
  title: PropTypes.string.isRequired
}
