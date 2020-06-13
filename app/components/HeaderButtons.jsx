import React from 'react'
import { Button } from '@material-ui/core'

import ActionMenu from './ActionMenu'
import { useSaveMap } from '../util/helpers'

export default function HeaderButtons() {
  const { isSaving, saveMap, confirmSave, emptySave } = useSaveMap()

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

      {confirmSave}
      {emptySave}
    </div>
  )
}