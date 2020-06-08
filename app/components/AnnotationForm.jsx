import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Input, Button } from '@material-ui/core'

import { callWithTargetValue } from '../util/helpers'
import Confirm from './Confirm'
import AnnotationTextEditor from './AnnotationTextEditor'

export default function AnnotationForm({ annotation }) {
  const { id, title, text } = annotation
  const textIsLong = text.length > 30

  const dispatch = useDispatch()
  const update = useCallback(attributes => {
    dispatch({ type: 'UPDATE_ANNOTATION', id, attributes  })
  }, [dispatch, id])

  const remove = useCallback(() => dispatch({ type: 'REMOVE_ANNOTATION', id }), [dispatch, id])

  const updateTitle = useCallback(callWithTargetValue(title => update({ title })), [update])
  const updateText = useCallback(text => update({ text }), [update])

  const [showConfirm, setShowConfirm] = useState(false)
  const openConfirm = useCallback(() => setShowConfirm(true), [])
  const closeConfirm = useCallback(() => setShowConfirm(false), [])
  const confirmRemove = useCallback(() => {
    remove()
    setShowConfirm(false)
  }, [remove])

  return (
    <div id="oligrapher-annotation-form">
      <div className="oligrapher-annotation-form-title">
        <Input
          id="oligrapher-annotation-form-title"
          placeholder="Annotation title"
          value={title}
          onChange={updateTitle}
          />
      </div>

      <div className="oligrapher-annotation-form-text">
        <AnnotationTextEditor
          text={text}
          onChange={updateText}
          />
      </div>

      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={textIsLong ? openConfirm : remove}>
        Remove
      </Button>

      <Confirm
        open={showConfirm}
        message={'Are you sure you want to remove this annotation?'}
        cancel={{ label: 'Cancel', onClick: closeConfirm }}
        confirm={{ label: 'Remove', onClick: confirmRemove }}
        />
    </div>
  )
}

AnnotationForm.propTypes = {
  annotation: PropTypes.object.isRequired
}