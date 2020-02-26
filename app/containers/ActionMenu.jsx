import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function ActionMenu() {
  const dispatch = useDispatch()

  return <div style={{position: "relative"}}>
           <div className="header-action-menu">
             <ul>
               <li onClick={() => dispatch({type: 'SET_MODE', mode: 'editor', enabled: false})}>
                 Present
               </li>
               <li>Publish Map</li>
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
