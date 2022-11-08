import React from "react"
import { useDispatch } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import { eventTargetIsFormElement } from "./helpers"

export default function (removeFunction: (event: KeyboardEvent) => void) {
  const dispatch = useDispatch()

  useHotkeys("escape", () => dispatch({ type: "CLOSE_EDITOR" }))

  useHotkeys("backspace, del", event => {
    if (removeFunction && !eventTargetIsFormElement(event)) {
      removeFunction(event)
    }
  })
}
