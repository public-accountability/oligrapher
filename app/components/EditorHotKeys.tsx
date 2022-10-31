import React from "react"
import { useDispatch } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import { KeyHandler } from "hotkeys-js"
import { eventTargetIsFormElement } from "../util/helpers"

const EditorHotKeys: React.FC<{ remove?: KeyHandler }> = ({ children, remove }) => {
  const dispatch = useDispatch()
  const closeEditor: KeyHandler = () => {
    dispatch({ type: "CLOSE_EDITOR" })
  }

  useHotkeys("escape", closeEditor)

  useHotkeys("backspace, del", event => {
    if (remove && !eventTargetIsFormElement(event)) {
      remove(event)
    }
  })

  return <>{children}</>
}

export default EditorHotKeys
