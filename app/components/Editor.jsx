import React from 'react'
//import loadable from '@loadable/component'
import { useSelector } from '../util/helpers'
import { enableLockSelector } from '../util/selectors'

import NodeTool from './NodeTool'
import TextTool from './TextTool'
import StyleNodesTool from './StyleNodesTool'
import InterlocksTool from './InterlocksTool'
import OrganizeTool from './OrganizeTool'
import Settings from './Settings'
import Editors from './Editors'
import Help from './Help'

import LockManager from './LockManager'
import EditorMenu from './EditorMenu'

// const LockManager = loadable(() => import('./LockManager'))
// const EditorMenu = loadable(() => import('./EditorMenu'))

/*
  Container for the editing interfaces
*/
export function Editor() {
  const tool = useSelector(state => state.display.tool)
  // const disabled = useSelector(state => !state.display.modes.editor)
  const className = 'oligrapher-graph-editor' + (tool === 'text' ? ' text-tool' : '')
  const enableLock = useSelector(enableLockSelector)

  return (
    <div className={className}>
      { enableLock &&
        <LockManager />
      }
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

export default Editor
