import React from 'react'
import Draggable from 'react-draggable'

import { useSelector } from '../util/helpers'
import NodeEditor from './NodeEditor'
import EdgeEditor from './EdgeEditor'
import CaptionEditor from './CaptionEditor'
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

  // key prop ensures that Draggable's position is 
  // reset when the id or type of menu changes
  const key = type + "-" + id
  
  return (
    <Draggable key={key} enableUserSelectHack={false} handle=".edit-menu-header" positionOffset={position || undefined}>
      <div className={ classNames("oligrapher-floating-editor", `oligrapher-${type}-editor`) }>
        { type === 'node' && <NodeEditor id={id} /> }
        { type === 'connections' && <AddConnections id={id} /> }
        { type === 'edge' && <EdgeEditor id={id} /> }
        { type === 'caption' && <CaptionEditor id={id} /> }
      </div>
    </Draggable>
  )
}
