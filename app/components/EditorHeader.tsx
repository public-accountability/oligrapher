import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'

interface EditorHeaderProps {
  title: string
}

export default function EditorHeader(props: EditorHeaderProps) {
  const dispatch = useDispatch()
  const closeEditor = useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), [dispatch])

  return (
    <header className="editor-header">
      <div>{props.title}</div>
      <button onClick={closeEditor}>
        <MdClose />
      </button>
    </header>
  )
}
