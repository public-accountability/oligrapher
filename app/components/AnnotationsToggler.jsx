import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

export default function AnnotationsToggler() {
  const dispatch = useDispatch()
  const toggle = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])
  const storyMode = useSelector(state => state.display.modes.story)

  return (
    <Button
      id="oligrapher-annotations-toggler"
      variant={storyMode ? "outlined" : "contained"}
      color={storyMode ? undefined : "primary"}
      size="small"
      onClick={toggle}
    >
      {storyMode ? "Hide" : "Show"} Annotations
    </Button>
  )
}