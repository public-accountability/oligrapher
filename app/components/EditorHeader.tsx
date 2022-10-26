import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { MdClose } from "@react-icons/all-files/md/MdClose"

interface EditorHeaderProps {
  title: string
  children?: React.ReactNode
}

export default function EditorHeader(props: EditorHeaderProps) {
  const dispatch = useDispatch()
  const closeEditor = useCallback(() => dispatch({ type: "CLOSE_EDITOR" }), [dispatch])

  return (
    <header className="editor-header">
      <div>{props.title}</div>
      {props.children}
      <button onClick={closeEditor}>
        <MdClose />
      </button>
    </header>
  )
}
