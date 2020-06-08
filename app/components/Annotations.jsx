import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

import Annotation from './Annotation'
import AnnotationList from './AnnotationList'
import AnnotationForm from './AnnotationForm'

export default function Annotations() {
  const dispatch = useDispatch()
  const create = useCallback(() => dispatch({ type: 'CREATE_ANNOTATION' }), [dispatch])

  const editing = useSelector(state => state.display.modes.editor)
  const { list, currentIndex } = useSelector(state => state.annotations)
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
        { editing && <span className="oligrapher-annotations-header">Edit Annotations</span> }

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

      { !editing && <Annotation annotation={annotation} /> }

      { editing && <AnnotationList list={list} currentIndex={currentIndex} /> }

      <br />

      { editing && (
        <Button
          onClick={create}
          variant="outlined"
          size="small"
        >
          Add Annotation
        </Button>
      ) }

      { editing && annotation && <AnnotationForm annotation={annotation} key={annotation.id} /> }
    </div>
  )
}