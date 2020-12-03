import React from 'react'
import Draggable from 'react-draggable'

import { useSelector } from '../util/helpers'
import NodeEditor from './NodeEditor'
import EdgeEditor from './EdgeEditor'
import CaptionEditor from './CaptionEditor'
import AddConnections from './AddConnections'
import AddConnectionsClassic from './AddConnectionsClassic'
import { floatingEditorPositionSelector } from '../util/floatingEditor'

export default function FloatingEditors() {
  const isEditor = useSelector(state => state.display.modes.editor)
  const { id, type } = useSelector(state => state.display.floatingEditor)
  const position = useSelector(floatingEditorPositionSelector)
  const useClassicAddConnections = useSelector(state => state.attributes.settings.useClassicAddConnections)

  if (!id || !type || !isEditor ) {
    return null
  }

  // key prop ensures that Draggable's position is
  // reset when the id or type of editor changes
  const key = type + "-" + id

  return (
    <Draggable key={key} enableUserSelectHack={false} handle=".editor-header" positionOffset={position || undefined}>
      <div className="oligrapher-floating-editor">
        { type === 'node' && <NodeEditor id={id} /> }
        { (type === 'connections' && !useClassicAddConnections) && <AddConnections id={id} /> }
        { (type === 'connections' && useClassicAddConnections) && <AddConnectionsClassic id={id} /> }
        { type === 'edge' && <EdgeEditor id={id} /> }
        { type === 'caption' && <CaptionEditor id={id} /> }
      </div>
    </Draggable>
  )
}
