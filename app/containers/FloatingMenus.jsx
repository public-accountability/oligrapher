import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Draggable from 'react-draggable'

import EditHeader from '../components/editor/EditMenuHeader'
import EditNode from './EditNode'
import EditEdge from './EditEdge'
import EditCaption from './EditCaption'
import AddConnections from '../components/tools/AddConnections'
import Settings from './Settings'
import Editors from '../components/tools/Editors'
import { classNames } from '../util/helpers'


export default function FloatingMenus() {
  const dispatch = useDispatch()
  const isEditor = useSelector(state => state.display.modes.editor)
  const { id, type, position } = useSelector(state => state.display.floatingMenu)

  if (!id || !type || !isEditor ) {
    return null
  }

  const openAddConnections = () => dispatch({ type: "OPEN_ADD_CONNECTIONS_MENU", id, position })

  const title = {
    node: "Customize Node",
    connections: "Add Connections",
    edge: "Customize Edge",
    caption: "Customize Text",
    style: "Style Nodes",
    settings: "Settings",
    editors: "Add Editors"
  }[type]

  // key prop ensures that Draggable's position is 
  // reset when the id or type of menu changes
  const key = type + "-" + id

  return (
    <Draggable key={key} enableUserSelectHack={false} handle=".edit-menu-header" positionOffset={position || undefined}>
      <div className="oligrapher-edit-menu">
        <div className={ classNames("edit-menu-wrapper", `edit-${type}-menu`) }>
          <EditHeader title={title} />
           { type === 'node' && <EditNode id={id} openAddConnections={openAddConnections} /> }
           { type === 'connections' && <AddConnections id={id} /> }
           { type === 'edge' && <EditEdge id={id} /> }
           { type === 'caption' && <EditCaption captionId={id} /> }
           { type === 'settings' && <Settings /> }
           { type === 'editors' && <Editors /> }
        </div>
      </div>
    </Draggable>  
  )
}
