import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IoIosPersonAdd, IoMdLink, IoIosMore } from 'react-icons/io'
import ActionMenu from './ActionMenu'

export default function HeaderButtons(props) {
  const [ actionMenuState, setActionMenuState ] = useState('CLOSED')
  const toggleActionMenu = () => actionMenuState === 'CLOSED' ? setActionMenuState('OPEN') : setActionMenuState('CLOSED')

  return <div className="oligrapher-header-buttons">
           <div>
             <button name="save" onClick={() => alert("saving")}>Save</button>
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
             { actionMenuState === 'OPEN' && <ActionMenu /> }
           </div>
         </div>
}
