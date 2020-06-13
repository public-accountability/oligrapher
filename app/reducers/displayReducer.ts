import produce from 'immer'

import FloatingEditor, { toggleEditor } from '../util/floatingEditor'
import { swapSelection, clearSelection } from '../util/selection'
import { isLittleSisId } from '../util/helpers'
import { DisplayState } from '../util/defaultState'
import { 
  createAnnotation, moveAnnotation, showAnnotation, updateAnnotation, removeAnnotation
} from '../util/annotations'

const ZOOM_INTERVAL = 1.2

export default produce((display: DisplayState, action: any): void => {
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
  case 'SET_SVG_OFFSET':
    display.svgOffset = action.svgOffset
    return
  case 'COLLAPSE_HEADER':
    display.headerIsCollapsed = true
    return
  case 'EXPAND_HEADER':
    display.headerIsCollapsed = false
    return
  case 'ADD_NODE':
    if (!isLittleSisId(action.node.id)) {
      toggleEditor(display, 'node', action.node.id)
    }
    return
  case 'REMOVE_NODE':
    FloatingEditor.clear(display)
    swapSelection(display, 'node', action.id)
    return
  case 'CLICK_NODE':
    clearSelection(display)
    toggleEditor(display, 'node', action.id)

    // select node if editing it
    if (FloatingEditor.getId(display, 'node') === action.id) {
      swapSelection(display, 'node', action.id)
    }
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
    clearSelection(display)
    toggleEditor(display, 'edge', action.id)
    return
  case 'ADD_CAPTION':
    toggleEditor(display, 'caption', action.id)
    return
  case 'REMOVE_CAPTION':
    FloatingEditor.clear(display)
    return
  case 'CLICK_CAPTION':
    clearSelection(display)
    toggleEditor(display, 'caption', action.id)
    return
  case 'ZOOM_IN':
    display.zoom = display.zoom * ZOOM_INTERVAL
    return
  case 'ZOOM_OUT':
    display.zoom = display.zoom / ZOOM_INTERVAL
    return
  case 'SET_EDITOR_MODE':
    clearSelection(display)
    display.tool = null
    FloatingEditor.clear(display)
    display.modes.editor = action.enabled
    return
  case 'TOGGLE_ANNOTATIONS':
    display.modes.story = !display.modes.story
    return
  case 'TOGGLE_TOOL':
    display.tool = (display.tool === action.tool) ? null : action.tool
    return
  case 'CLOSE_TOOL':
    display.tool = null
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
  case 'SAVE_REQUESTED':
    display.saveMapStatus = 'REQUESTED'
    display.userMessage = 'Saving map...'
    return
  case 'SAVE_SUCCESS':
    display.saveMapStatus = 'SUCCESS'
    display.userMessage = 'Saved map :)'
    return
  case 'SAVE_FAILED':
    display.saveMapStatus = 'FAILED'
    display.userMessage = 'Failed to save map :('
    return
  case 'SAVE_RESET':
    display.saveMapStatus = null
    display.userMessage = null
    return
  // Clone map actions
  case 'CLONE_REQUESTED':
    display.cloneMapStatus = 'REQUESTED'
    display.userMessage = 'Cloning map...'
    return
  case 'CLONE_SUCCESS':
    display.cloneMapStatus = 'SUCCESS'
    display.userMessage = 'Cloned map :)'
    return
  case 'CLONE_FAILED':
    display.cloneMapStatus = 'FAILED'
    display.userMessage = 'Failed to clone map :('
    return
  case 'CLONE_RESET':
    display.cloneMapStatus = null
    display.userMessage = null
    return
  // Clone map actions
  case 'DELETE_REQUESTED':
    display.deleteMapStatus = 'REQUESTED'
    display.userMessage = 'Deleting map...'
    return
  case 'DELETE_SUCCESS':
    display.deleteMapStatus = 'SUCCESS'
    display.userMessage = 'Deleted map :)'
    return
  case 'DELETE_FAILED':
    display.deleteMapStatus = 'FAILED'
    display.userMessage = 'Failed to delete map :('
    return
  case 'DELETE_RESET':
    display.cloneMapStatus = null
    display.userMessage = null
    return
  case 'FORCE_LAYOUT_REQUESTED':
    display.userMessage = 'Generating force-directed layout...'
    return
  case 'APPLY_FORCE_LAYOUT':
    display.userMessage = null
    return
  case 'ADD_EDITOR_REQUESTED':
    display.userMessage = 'Adding editor...'
    return
  case 'ADD_EDITOR_SUCCESS':
    display.userMessage = 'Added editor :)'
    return
  case 'ADD_EDITOR_FAILED':
    display.userMessage = 'Failed to add editor :('
    return
  case 'ADD_EDITOR_RESET':
    display.userMessage = null
    return
  case 'REMOVE_EDITOR_REQUESTED':
    display.userMessage = 'Removing editor...'
    return
  case 'REMOVE_EDITOR_SUCCESS':
    display.userMessage = 'Removed editor :)'
    return
  case 'REMOVE_EDITOR_FAILED':
    display.userMessage = 'Failed to remove editor :('
    return
  case 'REMOVE_EDITOR_RESET':
    display.userMessage = null
    return
  case 'INTERLOCKS_REQUESTED':
    display.userMessage = 'Fetching interlocks...'
    return
  case 'INTERLOCKS_SUCCESS':
    display.userMessage = 'Fetched interlocks :)'
    return
  case 'INTERLOCKS_FAILURE':
    display.userMessage = 'Failed to fetch interlocks :('
    return
  case 'INTERLOCKS_RESET':
    display.userMessage = null
    return
  case 'SET_SELECTING':
    display.selection.isSelecting = action.isSelecting
    return
  case 'SWAP_NODE_SELECTION':
    swapSelection(
      display,
      'node',
      action.id,
      Boolean(action.singleSelect)
    )
    FloatingEditor.clear(display)
    return
  case 'CLEAR_SELECTION':
    clearSelection(display)
    return
  default:
    return
  }
}, null)