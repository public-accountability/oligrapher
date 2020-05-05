import produce from 'immer'

import FloatingEditor, { toggleEditor } from '../util/floatingEditor'
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
      toggleEditor(display, 'node', action.node.id)
    }
    return
  case 'REMOVE_NODE':
    FloatingEditor.clear(display)
    return
  case 'CLICK_NODE':
    toggleEditor(display, 'node', action.id)
    return
  case 'DRAG_NODE':
    FloatingEditor.clear(display)
    display.draggedNode = action.node
    return
  case 'MOUSE_ENTERED_NODE':
    if (display.draggedNode && display.draggedNode.name !== action.name) {
      display.userMessage = `Create new edge between ${display.draggedNode.name} and ${action.name}`
    }
    return
  case 'MOUSE_LEFT_NODE':
    display.userMessage = null
    return
  case 'MOVE_NODE':
    display.userMessage = null
    display.draggedNode = null
    return
  case 'ADD_EDGE':
    if (!isLittleSisId(action.edge.id)) {
      toggleEditor(display, 'edge', action.edge.id)
    }
    return
  case 'REMOVE_EDGE':
    FloatingEditor.clear(display)
    return
  case 'CLICK_EDGE':
    toggleEditor(display, 'edge', action.id)
    return
  case 'ADD_CAPTION':
    toggleEditor(display, 'caption', action.id)
    return
  case 'REMOVE_CAPTION':
    FloatingEditor.clear(display)
    return
  case 'CLICK_CAPTION':
    toggleEditor(display, 'caption', action.id)
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
      FloatingEditor.set(display, 'connections', action.id)
    } else {
      console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
    }
    return
  case 'CLOSE_EDITOR':
    FloatingEditor.set(display)
    return
  case 'OPEN_EDTIOR':
    FloatingEditor.set(display, action.editorType, action.id)
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