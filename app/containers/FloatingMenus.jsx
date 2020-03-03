import React from 'react'
import { useSelector } from 'react-redux'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'
import EditCaptionMenu from './EditCaptionMenu'
import AddConnectionsMenu from './AddConnectionsMenu'
import StyleNodesMenu from './StyleNodesMenu'
import Settings from './Settings'
import Editors from '../components/tools/Editors'
import Lock from '../components/Lock'


export default function FloatingMenus() {
  const floatingMenu = useSelector(state => state.display.floatingMenu)
  const lock = useSelector(state => state.attributes.lock)
  const isEditor = useSelector(state => state.display.modes.editor)
  const isLocked = isEditor && lock?.locked && !lock.user_has_lock
  const openMenu = isLocked ? null : floatingMenu.type

  return <>
           <div style={{width: 0, overflow: "hidden"}} id="caption-text-input"></div>
           { isLocked && <Lock username="example" />}
           { openMenu === 'node' && <EditNodeMenu /> }
           { openMenu === 'connections' && <AddConnectionsMenu /> }
           { openMenu === 'edge' && <EditEdgeMenu /> }
           { openMenu === 'caption' && <EditCaptionMenu /> }
           { openMenu === 'style' && <StyleNodesMenu /> }
           { openMenu === 'settings' && <Settings /> }
           { openMenu === 'editors' && <Editors /> }
         </>
}
