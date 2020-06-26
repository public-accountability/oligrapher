import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Annotation from './Annotation'
import AnnotationsNav from './AnnotationsNav'
import AnnotationsTracker from './AnnotationsTracker'
import { annotationsListSelector } from '../util/selectors'
import { useClientRect } from '../util/helpers'

export default function CondensedAnnotations() {
  const dispatch = useDispatch()

  const { currentIndex } = useSelector(state => state.annotations)
  const list = useSelector(annotationsListSelector)
  const annotation = list[currentIndex]

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

  const ref = useClientRect(rect => {
    dispatch({ type: 'SET_SVG_BOTTOM', svgBottom: rect ? rect.top : null })
  })

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
}