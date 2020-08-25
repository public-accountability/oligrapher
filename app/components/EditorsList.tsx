import React from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

import { Editor } from '../util/defaultState'

export default function EditorsList({ editors, removeEditor }: EditorsListProps) {
  if (editors.length === 0) {
    return <div><em>This map has no other editors.</em></div>
  }

  return (
    <div className="oligrapher-editors-list">
      { editors.map(editor => (
        <div key={editor.name}>
          <a href={editor.url} target="_blank" rel="noopener noreferrer">{editor.name}</a>
          &nbsp;
          <span>{editor.pending ? "(pending)" : ""}</span>
          &nbsp;
          <a
            className="oligrapher-remove-editor"
            onClick={() => removeEditor(editor.name)}
          >
            <IoMdCloseCircle />
          </a>
        </div>
      )) }
    </div>
  )
}

interface EditorsListProps {
  editors: Editor[],
  removeEditor: (name: string) => void
}