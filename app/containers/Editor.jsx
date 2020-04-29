import React from 'react'

import { useSelector } from '../util/helpers'
import EditorMenu from './EditorMenu'
import NodeTool from '../components/tools/Node'
import TextTool from '../components/tools/Text'
import OrganizeTool from '../components/tools/Organize'
import Settings from '../components/tools/Settings'
import Editors from '../components/tools/Editors'
import LockPoll from './LockPoll'

/*
  Container for the editing interfaces
*/
export default function Editor() {
  const tool = useSelector(state => state.display.tool)
  const disabled = useSelector(state => !state.display.modes.editor)
  const className = 'oligrapher-graph-editor' + (tool === 'text' ? ' text-tool' : '')

  if (disabled) {
    return null
  }

  return (
    <div className={className}>
      <LockPoll />
      <EditorMenu />
      { tool === 'node' && <NodeTool /> }
      { tool === 'text' && <TextTool /> }
      { tool === 'organize' && <OrganizeTool /> }
      { tool === 'settings' && <Settings /> }
      { tool === 'editors' && <Editors /> }
    </div>
  )
}