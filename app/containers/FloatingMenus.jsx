import React from 'react'
import Draggable from 'react-draggable'

import { useSelector } from '../util/helpers'
import EditHeader from '../components/editor/EditMenuHeader'
import EditNode from './EditNode'
import EditEdge from './EditEdge'
import EditCaption from './EditCaption'
import AddConnections from '../components/tools/AddConnections'
import { classNames } from '../util/helpers'
import { floatingMenuPositionSelector } from '../util/floatingMenu'

export default function FloatingMenus() {
  const isEditor = useSelector(state => state.display.modes.editor)
  const { id, type } = useSelector(state => state.display.floatingMenu)
  const position = useSelector(floatingMenuPositionSelector)

  if (!id || !type || !isEditor ) {
    return null
  }

  const title = {
    node: "Customize Node",
    connections: "Add Connections",
    edge: "Customize Edge",
    caption: "Customize Text",
    style: "Style Nodes"
  }[type]

  // key prop ensures that Draggable's position is 
  // reset when the id or type of menu changes
  const key = type + "-" + id

  return (
    <Draggable key={key} enableUserSelectHack={false} handle=".edit-menu-header" positionOffset={position || undefined}>
      <div className="oligrapher-edit-menu">
        <div className={ classNames("edit-menu-wrapper", `edit-${type}-menu`) }>
          <EditHeader title={title} />
          { type === 'node' && <EditNode id={id} /> }
          { type === 'connections' && <AddConnections id={id} /> }
          { type === 'edge' && <EditEdge id={id} /> }
          { type === 'caption' && <EditCaption id={id} /> }
        </div>
      </div>
    </Draggable>  
  )
}
