import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'

import { StateWithHistory } from '../util/defaultState'
import { hasContents } from '../graph/graph'
import ConfirmSave from './ConfirmSave'
import EmptySave from './EmptySave'

export default function SaveButton() {
  const dispatch = useDispatch()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [emptyOpen, setEmptyOpen] = useState(false)
  const isSaving = useSelector<StateWithHistory, boolean>(state => state.display.saveMapStatus === 'REQUESTED')
  const version = useSelector<StateWithHistory, number | null>(state => state.attributes.version)
  const isEmpty = useSelector<StateWithHistory, boolean>(state => !hasContents(state.graph))

  const saveMap = useCallback(() => {
    if (isEmpty) {
      setEmptyOpen(true)
    } else if (version === 3) {
      dispatch({ type: 'SAVE_REQUESTED' })
    } else {
      setConfirmOpen(true)
    }
  }, [version, dispatch, isEmpty])

  const save = useCallback(() => {
    dispatch({ type: 'SAVE_REQUESTED' })
    setConfirmOpen(false)
  }, [dispatch])

  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  const closeEmpty = useCallback(() => setEmptyOpen(false), [])

  return (
    <>
      <Button
          id="oligrapher-save-button"
          onClick={saveMap}
          disabled={isSaving}
          disableElevation={true}
          variant="contained"
          size="small"
          color="primary"
        >
          Save
        </Button>

        <ConfirmSave open={confirmOpen} close={closeConfirm} save={save} />
        <EmptySave open={emptyOpen} close={closeEmpty} />
    </>
  )
}
