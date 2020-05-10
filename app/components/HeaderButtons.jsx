import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import ActionMenu from './ActionMenu'

export default function HeaderButtons() {
  const dispatch = useDispatch()
  const saveMap = useCallback(() => dispatch({ type: 'SAVE_REQUESTED' }), [dispatch])

  const isSaving = useSelector(state => state.display.saveMapStatus === 'REQUESTED')

  return (
    <div className="oligrapher-header-buttons">
      <div>
        <button name="save" onClick={saveMap} disabled={isSaving}>Save</button>
      </div>

      <div>
        <ActionMenu />
      </div>
    </div>
  )
}
