import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IoIosPersonAdd, IoMdLink, IoIosMore } from 'react-icons/io'

export function ActionMenu() {
  return <div style={{position: "relative"}}>
           <div className="header-action-menu">
             <ul>
               <li>Publish Map</li>
               <li>Present</li>
               <hr />
               <li>Clone</li>
               <li>Delete</li>
               <li>Create New</li>
               <hr />
               <li>Share</li>
               <li>Print</li>
               <li>Export</li>
             </ul>
           </div>
         </div>
}

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
