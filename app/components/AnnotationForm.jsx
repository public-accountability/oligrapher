import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Input, Button } from '@mui/material'
import loadable from '@loadable/component'

import { callWithTargetValue } from '../util/helpers'

import AnnotationTextEditor from './AnnotationTextEditor'

export default function AnnotationForm({ annotation }) {
  const { id, header, text } = annotation

  const dispatch = useDispatch()
  const update = useCallback(attributes => {
    dispatch({ type: 'UPDATE_ANNOTATION', id, attributes  })
  }, [dispatch, id])

  const clearHighlights = useCallback(
    () => dispatch({ type: 'CLEAR_HIGHLIGHTS' }),
    [dispatch]
  )

  const updateHeader = useCallback(callWithTargetValue(header => update({ header })), [update])
  const updateText = useCallback(text => update({ text }), [update])

  return (
    <div id="oligrapher-annotation-form">
      <div className="oligrapher-annotation-form-header">
        <Input
          id="oligrapher-annotation-form-header"
          placeholder="Annotation header"
          value={header}
          onChange={updateHeader}
          />
      </div>

      <div className="oligrapher-annotation-form-text">
        <AnnotationTextEditor
          text={text}
          onChange={updateText}
          />
      </div>

      <div className="oligrapher-annotation-highlighting-tip">
        Press the Control or ⌘ key while clicking on nodes, edges, or texts to add or remove highlights from this annotation.
        <br />
        <Button
          variant="outlined"
          size="small"
          onClick={clearHighlights}>
          Clear Highlighting
        </Button>
      </div>
    </div>
  )
}

AnnotationForm.propTypes = {
  annotation: PropTypes.object.isRequired
}
