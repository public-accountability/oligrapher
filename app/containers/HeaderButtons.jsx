import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { IoIosPersonAdd, IoMdLink, IoIosMore } from 'react-icons/io'

import { useSelector } from '../util/helpers'
import ActionMenu from './ActionMenu'
import saveMapAction from '../util/save'

export default function HeaderButtons() {
  const dispatch = useDispatch()
  const [ actionMenuState, setActionMenuState ] = useState('CLOSED')
  const toggleActionMenu = () => actionMenuState === 'CLOSED' ? setActionMenuState('OPEN') : setActionMenuState('CLOSED')

  const saveMap = useSelector(state => state.display.saveMap)

  return (
    <div className="oligrapher-header-buttons">
      <div>
        { !saveMap && <button name="save" onClick={() => dispatch(saveMapAction())}>Save</button> }
        { saveMap === "IN_PROGRESS" && <button>...saving...</button> }
        { saveMap === "SUCCESS" && <button><em>saved!</em></button> }
        { saveMap === "FAILED" && <button><em>failed to save map</em></button> }
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
