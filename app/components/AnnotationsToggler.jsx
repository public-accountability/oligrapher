import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'

export default function AnnotationsToggler() {
  const dispatch = useDispatch()
  const toggle = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])

  return (
    <Button
      id="oligrapher-annotations-toggler"
      variant="contained"
      color="primary"
      size="small"
      onClick={toggle}
    >
      Annotations
      {/* Show {list.length} annotation{list.length > 1 ? "s" : ""} */}
    </Button>
  )
}