import React from 'react'
import Draggable from 'react-draggable'

import { useSelector } from '../util/helpers'
import NodeEditor from './NodeEditor'
import EdgeEditor from './EdgeEditor'
import CaptionEditor from './CaptionEditor'
import AddConnections from './AddConnections'
import AddConnectionsClassic from './AddConnectionsClassic'
import { floatingEditorPositionSelector } from '../util/floatingEditor'
import { floatingEditorSelector } from '../util/selectors'

export default function FloatingEditors() {
  const floatingEditor = useSelector(floatingEditorSelector)
  const position = useSelector(floatingEditorPositionSelector)
  const useClassicAddConnections = useSelector(state => state.attributes.settings.useClassicAddConnections)

  // key prop ensures that Draggable's position is
  // reset when the id or type of editor changes
  const key = `${floatingEditor.type}-${floatingEditor.id}`
  const id = floatingEditor.id

  // positionOffset={position || undefined}

  return (
    <Draggable key={key} handle=".editor-header" positionOffset={position || undefined}>
      <div className="oligrapher-floating-editor" test-id="oligrapher-floating-editor">
        { floatingEditor.type === 'node' && <NodeEditor id={id} /> }
        { (floatingEditor.type === 'connections' && !useClassicAddConnections) && <AddConnections id={id} /> }
        { (floatingEditor.type === 'connections' && useClassicAddConnections) && <AddConnectionsClassic id={id} /> }
        { floatingEditor.type === 'edge' && <EdgeEditor id={id} /> }
        { floatingEditor.type === 'caption' && <CaptionEditor id={id} /> }
      </div>
    </Draggable>
  )
}
