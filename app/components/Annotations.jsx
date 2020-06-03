import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

import AnnotationList from './AnnotationList'
import AnnotationForm from './AnnotationForm'

export default function Annotations() {
  const dispatch = useDispatch()
  const create = useCallback(() => dispatch({ type: 'CREATE_ANNOTATION' }), [dispatch])

  const { list, currentIndex } = useSelector(state => state.display.annotations)
  const annotation = list[currentIndex]

  const prev = useCallback(
    () => dispatch({ type: 'SHOW_ANNOTATION', index: currentIndex - 1 }), 
    [dispatch, currentIndex]
  )

  const next = useCallback(
    () => dispatch({ type: 'SHOW_ANNOTATION', index: currentIndex + 1 }), 
    [dispatch, currentIndex]
  )

  return (
    <div id="oligrapher-annotations">
      <div id="oligrapher-annotations-nav">
        <Button 
          variant="outlined" 
          onClick={prev}
          disabled={currentIndex === 0}
        >Prev</Button>
        &nbsp;
        <Button 
          variant="outlined"
          onClick={next}
          disabled={currentIndex > list.length - 2 }
        >Next</Button>
      </div>

      <AnnotationList list={list} currentIndex={currentIndex} />

      <br />

      <Button
        onClick={create}
        variant="outlined"
        size="small"
      >
        Add Annotation
      </Button>

      { annotation && <AnnotationForm annotation={annotation} /> }
    </div>
  )
}