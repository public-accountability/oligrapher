import React from 'react'
import { useSelector } from 'react-redux'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'
import EditCaptionMenu from './EditCaptionMenu'
import AddConnectionsMenu from './AddConnectionsMenu'
import StyleNodesMenu from './StyleNodesMenu'
import Settings from './Settings'
import Editors from '../components/tools/Editors'

export default function FloatingMenus() {
  const openMenu = useSelector(state => state.display.floatingMenu.type)

  return <>
           <div style={{width: 0, overflow: "hidden"}} id="caption-text-input"></div>
           { openMenu === 'node' && <EditNodeMenu /> }
           { openMenu === 'connections' && <AddConnectionsMenu /> }
           { openMenu === 'edge' && <EditEdgeMenu /> }
           { openMenu === 'caption' && <EditCaptionMenu /> }
           { openMenu === 'style' && <StyleNodesMenu /> }
           { openMenu === 'settings' && <Settings /> }
           { openMenu === 'editors' && <Editors /> }
         </>
}
