import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'

import { useSelector } from '../util/helpers'
import ActionMenu from './ActionMenu'
import ConfirmSave from './ConfirmSave'

export default function HeaderButtons() {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const isSaving = useSelector(state => state.display.saveMapStatus === 'REQUESTED')
  const version = useSelector(state => state.attributes.oligrapher_version)

  const saveMap = useCallback(() => {
    if (version === 3) {
      dispatch({ type: 'SAVE_REQUESTED' })
    } else {
      setShowModal(true)
    }
  }, [version, dispatch, setShowModal])

  const confirmSaveMap = useCallback(() => {
    dispatch({ type: 'SAVE_REQUESTED' })
    setShowModal(false)
  }, [dispatch])

  const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  return (
    <div className="oligrapher-header-buttons">
      <Button onClick={saveMap} disabled={isSaving} disableElevation={true} variant="contained" size="small" color="primary">Save</Button>
      {/* <div>
        <button name="save" onClick={saveMap} disabled={isSaving}>Save</button>
      </div> */}

      &nbsp;

      <div>
        <ActionMenu />
      </div>

      <ConfirmSave open={showModal} close={closeModal} save={confirmSaveMap} />
    </div>
  )
}