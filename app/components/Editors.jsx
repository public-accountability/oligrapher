import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { IoMdCloseCircle } from 'react-icons/io'

import { useSelector } from '../util/helpers'
import Toolbox from './Toolbox'

export function EditorsList({ editors, removeEditor }) {
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
          <a onClick={() => removeEditor(editor.name)}><IoMdCloseCircle /></a>
        </div>
      )) }
    </div>
  )
}

EditorsList.propTypes = {
  editors: PropTypes.array.isRequired,
  removeEditor: PropTypes.func.isRequired
}

export default function Editors() {
  const dispatch = useDispatch()
  const editors = useSelector(state => state.attributes.editors)
  const oligrapherId = useSelector(state => state.attributes.id)

  const inputRef = useRef()
  const addEditor = useCallback(() => {
    if (inputRef.current.value) {
      dispatch({ type: 'ADD_EDITOR_REQUESTED', username: inputRef.current.value })
      inputRef.current.value = null
    }
  }, [dispatch])

  const removeEditor = useCallback(username => dispatch({ type: 'REMOVE_EDITOR_REQUESTED', username }), [dispatch])

  return (
    <Toolbox title="Editors">
      <div className="oligrapher-editors">

        <EditorsList editors={editors} removeEditor={removeEditor} />

        { !oligrapherId && <div><em>You must save this map before you can add editors.</em></div> }

        <div className="oligrapher-editors-input">
          <input type="text" placeholder="Enter username" ref={inputRef} />
          &nbsp;
          <button onClick={addEditor}>Add</button>
        </div>

        After you add an editor they must visit this page to confirm.
      </div>
    </Toolbox>
  )
}
