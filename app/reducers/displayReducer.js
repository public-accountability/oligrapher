import produce from 'immer'

import FloatingMenu, { toggleEditor } from '../util/floatingMenu'
import { isLittleSisId } from '../util/helpers'

const ZOOM_INTERVAL = 0.2

export default produce((display, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    display.actualZoom = action.actualZoom
    return
  case 'SET_SVG_ZOOM':
    display.svgZoom = action.svgZoom
    return
  case 'SET_OFFSET':
    display.offset = action.offset
    return
  case 'SET_SVG_SIZE':
    display.svgSize = action.size
    return  
  case 'ADD_NODE':
    if (!isLittleSisId(action.node.id)) {
      toggleEditor(display, action.node.id, 'node')
    }
    return
  case 'REMOVE_NODE':
    FloatingMenu.clear(display)
    return
  case 'CLICK_NODE':
    toggleEditor(display, action.id, 'node')
    return
  case 'DRAG_NODE':
    FloatingMenu.clear(display)
    return
  case 'REMOVE_EDGE':
    FloatingMenu.clear(display)
    return
  case 'CLICK_EDGE':
    toggleEditor(display, action.id, 'edge')
    return
  case 'ADD_CAPTION':
    toggleEditor(display, action.id, 'caption')
    return
  case 'REMOVE_CAPTION':
    FloatingMenu.clear(display)
    return
  case 'CLICK_CAPTION':
    toggleEditor(display, action.id, 'caption')
    return
  case 'ZOOM_IN':
    display.zoom = display.zoom + ZOOM_INTERVAL
    return
  case 'ZOOM_OUT':
    display.zoom = display.zoom - ZOOM_INTERVAL
    return
  case 'SET_MODE':
    display.modes[action.mode] = action.enabled
    return
  case 'TOGGLE_TOOL':
    display.tool = (display.tool === action.tool) ? null : action.tool
    return
  case 'OPEN_ADD_CONNECTIONS':
    if (isLittleSisId(action.id)) {
      FloatingMenu.set(display, 'connections', action.id)
    } else {
      console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
    }
    return
  case 'CLOSE_EDITOR':
    FloatingMenu.set(display)
    return
  case 'OPEN_EDTIOR':
    toggleEditor(display, action.id, action.editorType)
    return
  // Save map actions
  case 'SAVE_MAP_IN_PROGRESS':
    display.saveMap = 'IN_PROGRESS'
    return
  case 'SAVE_MAP_SUCCESS':
    display.saveMap = 'SUCCESS'
    return
  case 'SAVE_MAP_FAILED':
    display.saveMap = 'FAILED'
    return
  case 'SAVE_MAP_RESET':
    display.saveMap = null
    return
  default:
    return
  }
}, null)