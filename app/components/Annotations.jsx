import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

import Annotation from './Annotation'
import AnnotationList from './AnnotationList'
import RemoveAnnotationButton from './RemoveAnnotationButton'
import AnnotationForm from './AnnotationForm'
import AnnotationsNav from './AnnotationsNav'
import AnnotationsTracker from './AnnotationsTracker'
import HideAnnotationsButton from './HideAnnotationsButton'
import { annotationsListSelector } from '../util/selectors'

export default function Annotations() {
  const dispatch = useDispatch()
  const create = useCallback(() => dispatch({ type: 'CREATE_ANNOTATION' }), [dispatch])

  const editing = useSelector(state => state.display.modes.editor)
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

  return (
    <div id="oligrapher-annotations">
      <div id="oligrapher-annotations-nav">
        { editing && <span className="oligrapher-annotations-header">Edit Annotations</span> }

        { !editing && list.length > 1 &&
          <AnnotationsNav
            count={list.length}
            currentIndex={currentIndex}
            prev={prev}
            next={next}
            />
        }

        { !editing && list.length > 1 &&
          <AnnotationsTracker
            count={list.length}
            currentIndex={currentIndex}
            show={show}
            />
        }

        { !storyModeOnly &&
          <HideAnnotationsButton />
        }
      </div>

      { !editing && <Annotation annotation={annotation} /> }

      { editing && <AnnotationList list={list} currentIndex={currentIndex} /> }

      <br />

      { editing && (
        <div className="oligrapher-annotations-actions">
          <Button
            onClick={create}
            variant="outlined"
            size="small"
          >
            Add Annotation
          </Button>

          { annotation && <RemoveAnnotationButton annotation={annotation} /> }
        </div>
      ) }

      { editing && annotation &&
        <AnnotationForm
          annotation={annotation}
          key={annotation.id}
          />
      }
    </div>
  )
}