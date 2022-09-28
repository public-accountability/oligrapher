import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import merge from 'lodash/merge'
import without from 'lodash/without'
import isEqual from 'lodash/isEqual'
import clamp from 'lodash/clamp'

import {
  addNode, updateNode, removeNode, removeNodes, dragNodeEdges, moveNode,
  addEdgeIfNodes, addEdgesIfNodes, updateEdge, removeEdge,
  addCaption, addInterlocks, addEdge, calculateViewBoxFromGraph
} from './graph/graph'
import Caption from './graph/caption'
import { newEdgeFromNodes } from './graph/edge'
import { curveSimilarEdges } from './graph/curve'
import type { State } from './util/defaultState'

import {
  createAnnotation, moveAnnotation, showAnnotation, updateAnnotation, removeAnnotation,
  swapHighlight, clearHighlights
} from './util/annotations'

import updateSetting from './util/updateSetting'
import { Point, translatePoint } from './util/geometry'
import { updateLock } from './util/lock'
import FloatingEditor from './util/floatingEditor'
import { swapSelection, clearSelection, selectionCount } from './util/selection'
import { isLittleSisId } from './util/helpers'

const ZOOM_INTERVAL = 1.2

const DISPLAY_ACTIONS = new Set([
  'SET_SVG_HEIGHT',
  'SET_SVG_ZOOM',
  'SET_VIEWBOX',
  'COLLAPSE_HEADER',
  'EXPAND_HEADER',
  'COLLAPSE_HEADER',
  'EXPAND_HEADER',
  'SET_ZOOM',
  'HIDE_HEADER',
  'SHOW_HEADER',
  'HIDE_ZOOM_CONTROL',
  'SHOW_ZOOM_CONTROL'
])

const ACTION_TO_MESSAGE = {
  "FORCE_LAYOUT_REQUESTED": 'Generating force-directed layout...',
  "ADD_EDITOR_REQUESTED": 'Adding editor...',
  "ADD_EDITOR_SUCCESS": 'Added editor',
  "ADD_EDITOR_FAILED": 'Failed to add editor',
  "ADD_EDITOR_RESET": null,
  "REMOVE_EDITOR_REQUESTED": 'Removing editor...',
  "REMOVE_EDITOR_FAILED": 'Failed to remove editor',
  "REMOVE_EDITOR_RESET": null,
  "INTERLOCKS_REQUESTED": 'Fetching interlocks...',
  "INTERLOCKS_FAILED": 'Failed to fetch interlocks',
  "INTERLOCKS_RESET": null,
  "LOCK_TAKEOVER_REQUESTED": 'Taking over map lock...',
  "LOCK_TAKEOVER_SUCCESS": 'Took over map lock',
  "LOCK_TAKEOVER_FAILED": 'Failed to take over map lock',
  "LOCK_TAKEOVER_RESET": null,
  "LOCK_RELEASE_REQUESTED": 'Releasing map lock...',
  "LOCK_RELEASE_SUCCESS": 'Released map lock',
  "LOCK_RELEASE_FAILED": 'Failed to release map lock',
  "LOCK_RELEASE_RESET": null,
  "EXPORT_IMAGE_REQUESTED": 'Exporting...',
  "EXPORT_IMAGE_SUCCESS": 'Exported map to JPG',
  "EXPORT_IMAGE_FAILED": 'Failed to export',
  "EXPORT_IMAGE_RESET": null
}

const MESSAGE_ACTIONS = new Set(Object.keys(ACTION_TO_MESSAGE))

function moveNodeAndEdges(state: State, id: string, deltas: Point): void {
  moveNode(state.graph, id, deltas)
  dragNodeEdges(state.graph, id, { x: 0, y: 0 })
}

const builderCallback = (builder: ActionReducerMapBuilder<State>) => {
  builder.addCase('SET_SAVED_DATA', (state, action) => {
    state.lastSavedData = action.data
  })

  builder.addCase('CREATE_ANNOTATION', (state, action) => {
    createAnnotation(state.annotations)
  })

  builder.addCase('MOVE_ANNOTATION', (state, action) => {
    moveAnnotation(state.annotations, action.from, action.to)
  })

  builder.addCase('SHOW_ANNOTATION', (state, action) => {
    showAnnotation(state.annotations, action.index)
  })

  builder.addCase('UPDATE_ANNOTATION', (state, action) => {
    updateAnnotation(state.annotations, action.id, action.attributes)
  })

  builder.addCase('CLEAR_HIGHLIGHTS', (state, action) => {
    clearHighlights(state.annotations)
  })

  builder.addCase('REMOVE_ANNOTATION', (state, action) => {
    removeAnnotation(state.annotations, action.id)
  })

  builder.addCase('SET_HIGHLIGHTING', (state, action) => {
    state.annotations.isHighlighting = action.isHighlighting
  })

  builder.addCase('SWAP_NODE_HIGHLIGHT', (state, action) => {
    swapHighlight(state.annotations, 'node', action.id)
  })

  builder.addCase('SWAP_EDGE_HIGHLIGHT', (state, action) => {
    swapHighlight(state.annotations, 'edge', action.id)
  })

  builder.addCase('SWAP_CAPTION_HIGHLIGHT', (state, action) => {
    swapHighlight(draft.annotations, 'caption', action.id)
  })

  builder.addCase('SET_EDITOR_MODE', (state, action) => {
    state.annotations.currentIndex = 0
    clearSelection(state.display)
    state.display.tool = null
    FloatingEditor.clear(state.display)
    state.display.modes.editor = action.enabled
  })

  builder.addCase('ADD_NODE', (state, action) => {
    addNode(state.graph, action.node, action.position || true)

    if (!isLittleSisId(action.node.id)) {
      FloatingEditor.toggleEditor(state.display, 'node', action.node.id)
    }
  })

  builder.addCase('UPDATE_NODE', (state, action) => {
    updateNode(state.graph, action.id, action.attributes)
  })

  builder.addCase('UPDATE_NODES', (state, action) => {
    action.nodeIds.forEach((nodeId: string) => {
      updateNode(state.graph, nodeId, action.attributes)
    })
  })

  builder.addCase('REMOVE_NODE', (state, action) => {
    removeNode(state.graph, action.id)
    FloatingEditor.clear(state.display)
    swapSelection(state.display, 'node', action.id)
  })

  builder.addCase('REMOVE_NODES', (state, action) => {
    removeNodes(state.graph, action.ids)
    clearSelection(state.display)
  })

  builder.addCase('CLICK_NODE', (state, action) => {
    // Because CLICK_NODE is triggered instead of MOVE_NODE by DraggableComponent,
    // and can happen after small (< 5) movement, we still call this function
    moveNodeAndEdges(state, action.id, action.deltas)

    if (action.shiftKey) {
      if (state.display.selection.node.includes(action.id)) {
        state.display.selection.node = without(state.display.selection.node, action.id)
      } else {
        state.display.selection.node.push(action.id)
      }
    } else {
      if (state.display.floatingEditor.type === 'node' && state.display.floatingEditor.id === action.id) {
        state.display.selection.node = without(state.display.selection.node, action.id)
        FloatingEditor.clear(state.display)
      } else {
        state.display.selection.node = [action.id]
        FloatingEditor.toggleEditor(state.display, 'node', action.id)
      }
    }
  })

  builder.addCase('MOUSE_ENTERED_NODE', (state, action) => {
    state.display.overNode = action.id

    if (state.display.modes.editor && state.display.draggedNode && state.display.draggedNode !== action.id) {
      const draggedNodeName = state.graph.nodes[state.display.draggedNode].name
      const hoveringName = state.graph.nodes[action.id].name

      state.display.userMessage = `Drop node to create new edge between ${draggedNodeName} and ${hoveringName}`
    }
  })

  builder.addCase('MOUSE_LEFT_NODE', (state, action) => {
    state.display.overNode = null
    state.display.userMessage = null
  })

  builder.addCase('DRAG_NODE_START', (state, action) => {
    state.display.draggedNode = action.id
    // clearSelection(state.display)
    // if (state.display.overNode === action.id) {
    //   state.display.overNode = null
    //}
  })

  builder.addCase('DRAG_NODE_STOP', (state, action) => {
    state.display.draggedNode = null
  })

  builder.addCase('DRAG_NODE', (state, action) => {
    dragNodeEdges(state.graph, action.id, action.deltas)
  })

  // builder.addCase('MOVE_NODE', (state, action) => {
  //   moveNode(state.graph, action.id, action.deltas)
  //   dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })
  // })

  builder.addCase('MOVE_NODE_OR_ADD_EDGE_FROM_DRAG', (state, action) => {
    // When dragging over another node create a new edge
    if (state.display.overNode && state.display.overNode !== action.id) {
      const node1 = state.graph.nodes[action.id]
      const node2 = state.graph.nodes[state.display.overNode]

      const edge = newEdgeFromNodes(node1, node2)
      // are there already edges between these two nodes?
      const nodeIds = new Set([edge.node1_id, edge.node2_id])
      const similarEdges = Object.values(state.graph.edges).filter(e => isEqual(new Set([e.node1_id, e.node2_id]), nodeIds))
      // if there are
      if (similarEdges.length > 0) {
        // delete them
        similarEdges.forEach(e => removeEdge(state.graph, e.id))
        // change the curves and add them to the graph
        curveSimilarEdges(similarEdges.concat([edge])).forEach(e => addEdge(state.graph, e))
      } else {
        addEdge(state.graph, edge)
      }
      // reset edges back to original position
      dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })
    // Otherwise move the node
    } else {
      moveNodeAndEdges(state, action.id, action.deltas)
    }
  })

  builder.addCase('ADD_EDGE', (state, action) => {
    addEdgeIfNodes(state.graph, action.edge)
    dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })

    if (!isLittleSisId(action.edge.id)) {
      FloatingEditor.toggleEditor(state.display, 'edge', action.edge.id)
    }
  })

  builder.addCase('ADD_EDGES', (state, action) => {
    addEdgesIfNodes(state.graph, action.edges)
  })

  builder.addCase('UPDATE_EDGE', (state, action) => {
    updateEdge(state.graph, action.id, action.attributes)
  })

  builder.addCase('REMOVE_EDGE', (state, action) => {
    removeEdge(state.graph, action.id)
    FloatingEditor.clear(state.display)
  })

  builder.addCase('ADD_CAPTION', (state, action) => {
    addCaption(state.graph, merge(
      Caption.fromEvent(action.event),
      { id: action.id }
    ))

    toggleEditor(state.display, 'caption', action.id)
  })

  builder.addCase('UPDATE_CAPTION', (state, action) => {
    merge(state.graph.captions[action.id], action.attributes)
  })

  builder.addCase('MOVE_CAPTION', (state, action) => {
    merge(state.graph.captions[action.id], translatePoint(state.graph.captions[action.id], action.deltas))
  })

  builder.addCase('REMOVE_CAPTION', (state, action) => {
    delete state.graph.captions[action.id]
    FloatingEditor.clear(state.display)
  })

  builder.addCase('APPLY_FORCE_LAYOUT', (state, action) => {
    state.graph = action.graph
    state.display.userMessage = null
  })

  builder.addCase('INTERLOCKS_SUCCESS', (state, action) => {
    addInterlocks(state.graph, action.node1Id, action.node2Id, action.nodes, action.edges)
    state.display.userMessage = action.nodes.length > 0 ? `Fetched ${action.nodes.length} interlocks` : 'No interlocks found'
  })

  builder.addCase('RESET_VIEW', (state, action) => {
    state.display.viewBox = calculateViewBoxFromGraph(state.graph)
    state.display.zoom = 1
  })

  builder.addCase('CLICK_EDGE', (state, action) => {
    clearSelection(state.display)
    FloatingEditor.toggleEditor(state.display, 'edge', action.id)
  })

  builder.addCase('CLICK_CAPTION', (state, action) => {
    clearSelection(state.display)
    FloatingEditor.toggleEditor(state.display, 'caption', action.id)
  })

  builder.addCase('ZOOM_IN', (state, action) => {
    state.display.zoom = state.display.zoom * (action.interval || ZOOM_INTERVAL)
  })

  builder.addCase('ZOOM_OUT', (state, action) => {
    state.display.zoom = state.display.zoom / (action.interval || ZOOM_INTERVAL)
  })

  builder.addCase('TOGGLE_ANNOTATIONS', (state, action) => {
    state.display.modes.story = !state.display.modes.story
  })

  builder.addCase('HIDE_ANNOTATIONS', (state, action) => {
    state.display.modes.story = false
  })

  builder.addCase('SHOW_ANNOTATIONS', (state, action) => {
    state.display.modes.story = true
  })

  builder.addCase('TOGGLE_TOOL', (state, action) => {
    const prevTool = state.display.tool
    state.display.tool = (state.display.tool === action.tool) ? null : action.tool

    // if new tool has been opened
    if (state.display.tool && state.display.tool !== prevTool) {
      // close floating editor
      FloatingEditor.clear(state.display)

      // clear single selection
      if (selectionCount(state.display) === 1) {
        clearSelection(state.display)
      }
    }
  })

  builder.addCase('CLOSE_TOOL', (state, action) => {
    state.display.tool = null
  })

  builder.addCase('OPEN_ADD_CONNECTIONS', (state, action) => {
    if (isLittleSisId(action.id)) {
      FloatingEditor.set(state.display, 'connections', action.id)
    } else {
      console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
    }

  })

  builder.addCase('CLOSE_EDITOR', (state, action) => {
    FloatingEditor.clear(state.display)
  })

  builder.addCase('OPEN_EDTIOR', (state, action) => {
    FloatingEditor.set(state.display, action.editorType, action.id)
  })

  builder.addCase('SAVE_REQUESTED', (state, action) => {
    state.display.saveMapStatus = 'REQUESTED'
    state.display.userMessage = 'Saving map...'
  })

  builder.addCase('SAVE_SUCCESS', (state, action) => {
    if (!state.attributes.id) {
      state.attributes.id = action.id
    }

    state.display.saveMapStatus = 'SUCCESS'
    state.display.userMessage = 'Saved map :)'
  })

  builder.addCase('SAVE_FAILED', (state, action) => {
    state.display.saveMapStatus = 'FAILED'
    state.display.userMessage = 'Failed to save map :('
  })

  builder.addCase('SAVE_RESET', (state, action) => {
    state.display.saveMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase('CLONE_REQUESTED', (state, action) => {
    state.display.cloneMapStatus = 'REQUESTED'
    state.display.userMessage = 'Cloning map...'
  })

  builder.addCase('CLONE_SUCCESS', (state, action) => {
    state.display.cloneMapStatus = 'SUCCESS'
    state.display.userMessage = 'Cloned map :)'
  })

  builder.addCase('CLONE_FAILED', (state, action) => {
    state.display.cloneMapStatus = 'FAILED'
    state.display.userMessage = 'Failed to clone map :('
  })

  builder.addCase('CLONE_RESET', (state, action) => {
    state.display.cloneMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase('DELETE_REQUESTED', (state, action) => {
    state.display.deleteMapStatus = 'REQUESTED'
    state.display.userMessage = 'Deleting map...'
  })

  builder.addCase('DELETE_SUCCESS', (state, action) => {
    state.display.deleteMapStatus = 'SUCCESS'
    state.display.userMessage = 'Deleted map :)'
  })

  builder.addCase('DELETE_FAILED', (state, action) => {
    state.display.deleteMapStatus = 'FAILED'
    state.display.userMessage = 'Failed to delete map :('
  })

  builder.addCase('DELETE_RESET', (state, action) => {
    state.display.cloneMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase('SET_SELECTING', (state, action) => {
    state.display.selection.isSelecting = action.isSelecting
  })

  builder.addCase('SWAP_NODE_SELECTION', (state, action) => {
    swapSelection(
      state.display,
      'node',
      action.id,
      Boolean(action.singleSelect)
    )
    FloatingEditor.clear(state.display)
  })

  builder.addCase('CLEAR_SELECTION', (state, action) => {
    clearSelection(state.display)
  })

  builder.addCase('UPDATE_ATTRIBUTE', (state, action) => {
    state.attributes[action.name] = action.value
  })

  builder.addCase('UPDATE_SETTING', (state, action) => {
    updateSetting(state.attributes, action.key, action.value)
  })

  builder.addCase('REMOVE_EDITOR_SUCCESS', (state, action) => {
    state.attributes.editors = action.editors
    state.display.userMessage = 'Removed editor'
  })

  builder.addCase('SET_LOCK', (state, action) => {
    state.attributes.lock = updateLock(state.attributes.lock, action.lock)
    if (action.lock.editors) {
      state.attributes.editors = action.lock.editors
    }
  })

  builder.addCase('SET_SVG_SIZE', (state, action) => {
    state.display.svgSize = action.svgSize
  })

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
  builder.addCase('SET_ZOOM_FROM_SCROLL', (state, action) => {
    state.display.zoom = clamp(
      state.display.zoom + (action.deltaY * -0.01),
      0.25,
      10
    )
  })

  builder.addMatcher(action => MESSAGE_ACTIONS.has(action.type), (state, action) => {
    state.display.userMessage = ACTION_TO_MESSAGE[action.type]
  })

  // Simple assignment action to state.display
  builder.addMatcher(action => DISPLAY_ACTIONS.has(action.type), (state, action) => {
    switch(action.type) {
      case 'SET_SVG_TOP':
        state.display.svgTop = action.svgTop
        break
      case 'SET_SVG_HEIGHT':
        state.display.svgHeight = action.height
        // state.display.svgSize.height = action.height
        break
      case 'SET_VIEWBOX':
        state.display.viewBox = action.viewBox
        break
      case 'COLLAPSE_HEADER':
        state.display.headerIsCollapsed = true
        break
      case 'EXPAND_HEADER':
        state.display.headerIsCollapsed = false
        break
      case 'SET_ZOOM':
        state.display.zoom = action.zoom
        break
      case 'HIDE_HEADER':
        state.display.showHeader = false
        break
      case 'SHOW_HEADER':
        state.display.showHeader = true
        break
      case 'HIDE_ZOOM_CONTROL':
        state.display.showZoomControl = false
        break
      case 'SHOW_ZOOM_CONTROL':
        state.display.showZoomControl = true
        break
      default:
    }
  })
}

export default builderCallback
