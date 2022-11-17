import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import IconButton from "@mui/material/IconButton"

import { MdClose } from "react-icons/md"

export default function HideAnnotationsButton() {
  const dispatch = useDispatch()
  const hide = useCallback(() => dispatch({ type: "TOGGLE_ANNOTATIONS" }), [dispatch])

  return (
    <IconButton aria-label="Hide annotations" title="Hide annotations" onClick={hide}>
      <MdClose />
    </IconButton>
  )
}
