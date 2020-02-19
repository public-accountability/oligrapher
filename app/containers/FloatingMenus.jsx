import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import EditNodeMenu from './EditNodeMenu'
import EditEdgeMenu from './EditEdgeMenu'
import EditCaptionMenu from './EditCaptionMenu'
import Settings from './Settings'

export default function FloatingMenus() {
  const openMenu = useSelector(state => state.display.floatingMenu)
  return <>
           <div style={{width: 0, overflow: "hidden"}} id="caption-text-input"></div>
           { openMenu === 'node' && <EditNodeMenu /> }
           { openMenu === 'edge' && <EditEdgeMenu /> }
           { openMenu === 'caption' && <EditCaptionMenu /> }
           { openMenu === 'settings' && <Settings /> }
         </>
}

FloatingMenus.propTypes = {
  visible: PropTypes.shape({
    editNodeMenu: PropTypes.bool.isRequired,
    editEdgeMenu: PropTypes.bool.isRequired,
    editCaptionMenu: PropTypes.bool.isRequired,
    settingsMenu: PropTypes.bool.isRequired
  })
}
