import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { IoIosPersonAdd, IoMdLink, IoIosMore } from 'react-icons/io'

import { useSelector } from '../util/helpers'
import ActionMenu from './ActionMenu'

export default function HeaderButtons() {
  const dispatch = useDispatch()
  const saveMap = useCallback(() => dispatch({ type: 'SAVE_REQUESTED' }), [dispatch])

  const [ actionMenuState, setActionMenuState ] = useState('CLOSED')
  const toggleActionMenu = () => actionMenuState === 'CLOSED' ? setActionMenuState('OPEN') : setActionMenuState('CLOSED')

  const isSaving = useSelector(state => state.display.saveMapStatus === 'REQUESTED')

  return (
    <div className="oligrapher-header-buttons">
      <div>
        <button name="save" onClick={saveMap} disabled={isSaving}>Save</button>
      </div>

      <div>
        <span><IoIosPersonAdd /></span>
      </div>

      <div>
        <span><IoMdLink /></span>
      </div>

      <div>
        <span className="toggle-action-menu" onClick={toggleActionMenu}><IoIosMore /></span>
      </div>

      <div>
        { actionMenuState === 'OPEN' && <ActionMenu toggleActionMenu={toggleActionMenu} /> }
      </div>
    </div>
  )
}
