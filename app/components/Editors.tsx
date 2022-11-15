import React, { useCallback, useRef } from "react"
import { useDispatch } from "react-redux"

import { useSelector } from "../util/helpers"
import Toolbox from "./Toolbox"
import EditorsList from "./EditorsList"

export default function Editors() {
  const dispatch = useDispatch()
  const editors = useSelector(state => state.attributes.editors)
  const id = useSelector(state => state.attributes.id)
  const inputRef = useRef(null)

  const addEditor = useCallback(() => {
    if (inputRef.current?.value) {
      dispatch({ type: "ADD_EDITOR_REQUESTED", username: inputRef.current.value })
      inputRef.current.value = null
    }
  }, [inputRef])

  const removeEditor = username => dispatch({ type: "REMOVE_EDITOR_REQUESTED", username })

  return (
    <Toolbox title="Editors">
      <div className="oligrapher-editors">
        <EditorsList editors={editors} removeEditor={removeEditor} />
        {!id && (
          <div>
            <em>You must save this map before you can add editors.</em>
          </div>
        )}
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
