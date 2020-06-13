import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

import { annotationsListSelector } from '../util/selectors'

export default function AnnotationsToggler() {
  const dispatch = useDispatch()
  const list = useSelector(annotationsListSelector)
  const { storyModeOnly, exploreModeOnly } = useSelector(state => state.attributes.settings)
  const toggle = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])

  if (storyModeOnly || exploreModeOnly || list.length < 1) {
    return null
  }

  return (
    <Button
      id="oligrapher-annotations-toggler"
      variant="outlined"
      size="small"
      onClick={toggle}
    >
      Annotations
      {/* Show {list.length} annotation{list.length > 1 ? "s" : ""} */}
    </Button>
  )
}