import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid } from '@material-ui/core'

import Annotation from './Annotation'
import AnnotationsNav from './AnnotationsNav'
import AnnotationsTracker from './AnnotationsTracker'
import { annotationsListSelector } from '../util/selectors'

const CondensedAnnotations = React.forwardRef(function Func(props, ref) {
  const dispatch = useDispatch()

  const { currentIndex } = useSelector(state => state.annotations)
  const list = useSelector(annotationsListSelector)
  const annotation = list[currentIndex]
  const { storyModeOnly } = useSelector(state => state.attributes.settings)

  const prev = useCallback(
    () => dispatch({ type: 'SHOW_ANNOTATION', index: currentIndex - 1 }), 
    [dispatch, currentIndex]
  )

  const next = useCallback(
    () => dispatch({ type: 'SHOW_ANNOTATION', index: currentIndex + 1 }), 
    [dispatch, currentIndex]
  )

  const show = useCallback(
    index => dispatch({ type: 'SHOW_ANNOTATION', index }),
    [dispatch]
  )

  if (!annotation) {
    return null
  }

  return (
    <div id="oligrapher-annotations-condensed" ref={ref}>
      { list.length > 1 &&
        <div id="oligrapher-annotations-condensed-nav">
          <AnnotationsNav
            count={list.length}
            currentIndex={currentIndex}
            prev={prev}
            next={next}
            size="small"
            />

          <AnnotationsTracker
            count={list.length}
            currentIndex={currentIndex}
            show={show}
            />
        </div>
      }

      <Annotation annotation={annotation} />
    </div>
  )
})

export default CondensedAnnotations