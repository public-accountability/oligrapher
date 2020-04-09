import React from 'react'
import { useSelector } from 'react-redux'
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
  let { id, type, position } = useSelector(state => state.display.floatingMenu)
  const isEditor = useSelector(state => state.display.modes.editor)

  if (!type || !isEditor) {
    return null
  }

  const titles = {
    node: "Customize Node",
    connections: "Add Connections",
    edge: "Customize Edge",
    caption: "Customize Text",
    style: "Style Nodes",
    settings: "Settings",
    editors: "Add Editors"
  }

  return (
    <Draggable enableUserSelectHack={false} handle=".edit-menu-header" positionOffset={position || undefined}>
      <div className="oligrapher-edit-menu">
        <div className={ classNames("edit-menu-wrapper", `edit-${type}-menu`) }>
          <EditHeader title={titles[type]} />
           { type === 'node' && <EditNode id={id} /> }
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
