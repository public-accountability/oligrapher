import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

import { classNames } from '../../util/helpers'
import EditMenuHeader from './EditMenuHeader'

const titles = {
  node: "Edit & Customize Node",
  edge: "Customize Edge",
  caption: "Customize Text",
  settings: "Settings"
}

export default function EditMenu(props) {
  // see github.com/mzabriskie/react-draggable/issues/410 for reason behind enableUserSelectHack
  return <Draggable enableUserSelectHack={false} handle=".edit-menu-header">
           <div className="oligrapher-edit-menu">
             <div className={ classNames("edit-menu-wrapper", `edit-${props.tool}-menu`) }>
               <EditMenuHeader title={titles[props.tool]} />
               {props.children}
             </div>
           </div>
         </Draggable>
}

EditMenu.propTypes = {
  tool: PropTypes.oneOf(['node', 'edge', 'caption', 'settings']).isRequired,
  children: PropTypes.node.isRequired
}
