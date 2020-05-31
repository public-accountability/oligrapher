import React from 'react'

import { useSelector } from '../util/helpers'
import EditorMenu from './EditorMenu'
import NodeTool from './NodeTool'
import TextTool from './TextTool'
import StyleNodesTool from './StyleNodesTool'
import InterlocksTool from './InterlocksTool'
import OrganizeTool from './OrganizeTool'
import Settings from './Settings'
import Editors from './Editors'
import Help from './Help'
import Lock from './Lock'
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
      <Lock />
      <LockPoll />
      <EditorMenu />
      { tool === 'node' && <NodeTool /> }
      { tool === 'text' && <TextTool /> }
      { tool === 'style' && <StyleNodesTool /> }
      { tool === 'interlocks' && <InterlocksTool /> }
      { tool === 'organize' && <OrganizeTool /> }
      { tool === 'settings' && <Settings /> }
      { tool === 'editors' && <Editors /> }
      { tool === 'help' && <Help /> }
    </div>
  )
}