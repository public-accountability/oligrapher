import React, { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import Button from "@mui/material/Button"

import type { Annotation } from "../util/annotations"
import Confirm from "./Confirm"

export default function RemoveAnnotationButton({ annotation }: { annotation: Annotation }) {
  const dispatch = useDispatch()
  const { id, text } = annotation
  const mustConfirm = text && text.length > 30
  const [showConfirm, setShowConfirm] = useState(false)
  const openConfirm = useCallback(() => setShowConfirm(true), [])
  const closeConfirm = useCallback(() => setShowConfirm(false), [])
  const remove = useCallback(() => dispatch({ type: "REMOVE_ANNOTATION", id }), [dispatch, id])
  const confirmRemove = useCallback(() => {
    remove()
    setShowConfirm(false)
  }, [remove])

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={mustConfirm ? openConfirm : remove}
      >
        Remove
      </Button>

      <Confirm
        open={showConfirm}
        message={"Are you sure you want to remove this annotation?"}
        cancel={{ label: "Cancel", onClick: closeConfirm }}
        confirm={{ label: "Remove", onClick: confirmRemove }}
      />
    </>
  )
}
