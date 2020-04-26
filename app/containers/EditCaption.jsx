import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import EditCaptionFont from './EditCaptionFont'
import EditCaptionWeight from './EditCaptionWeight'
import EditCaptionSize from './EditCaptionSize'
import { callWithTargetValue } from '../util/helpers'

export default function EditCaption({ id }) {  
  const dispatch = useDispatch()
  const caption = useSelector(state => state.graph.captions[id])

  const deleteCaption = useCallback(() => dispatch({ type: 'DELETE_CAPTION', id }), [dispatch, id])
  const onChange = useCallback(type => { 
    return callWithTargetValue(value => dispatch({ type: 'UPDATE_CAPTION', id, attributes: { [type]: value } }))
  }, [dispatch, id])

  return (
    <div className="edit-caption">
      <main>
        <label>Font</label>
        <br />
        <EditCaptionFont value={caption.font} onChange={onChange('font')} />
        <br />
        <EditCaptionWeight value={caption.weight} onChange={onChange('weight')} />
        <EditCaptionSize value={caption.size} onChange={onChange('size')} />
      </main>

      <footer>
        <EditMenuSubmitButtons 
          hideSubmitButton={true}
          handleDelete={deleteCaption}
          page="main" />
      </footer>
    </div>
  )
}

EditCaption.propTypes = {
  id: PropTypes.string.isRequired,
}