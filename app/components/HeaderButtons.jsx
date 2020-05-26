import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'

import { useSelector } from '../util/helpers'
import ActionMenu from './ActionMenu'
import ConfirmSave from './ConfirmSave'

export default function HeaderButtons() {
  const dispatch = useDispatch()
  const [showSave, setShowSave] = useState(false)
  const isSaving = useSelector(state => state.display.saveMapStatus === 'REQUESTED')
  const version = useSelector(state => state.attributes.version)

  const saveMap = useCallback(() => {
    if (version === 3) {
      dispatch({ type: 'SAVE_REQUESTED' })
    } else {
      setShowSave(true)
    }
  }, [version, dispatch])

  const confirmSaveMap = useCallback(() => {
    dispatch({ type: 'SAVE_REQUESTED' })
    setShowSave(false)
  }, [dispatch])

  const closeSave = useCallback(() => setShowSave(false), [])
  const closeShare = useCallback(() => setShowShare(false), [])


  return (
    <div className="oligrapher-header-buttons">
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

      &nbsp;

      <ActionMenu />

      <ConfirmSave open={showSave} close={closeSave} save={confirmSaveMap} />
    </div>
  )
}