import produce from 'immer'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'

import Caption from './graph/caption'
// import Graph from './graph/graph'

import { State } from './util/defaultState'

import {
  addNode, updateNode, removeNode, removeNodes, dragNodeEdges, moveNode,
  addEdgeIfNodes, addEdgesIfNodes, updateEdge, removeEdge,
  addCaption, addInterlocks, addEdge
} from './graph/graph'

import { curveSimilarEdges } from './graph/curve'

import {
  createAnnotation, moveAnnotation, showAnnotation, updateAnnotation, removeAnnotation,
  swapHighlight, clearHighlights
} from './util/annotations'

import updateSetting from './util/updateSetting'
import { translatePoint } from './util/geometry'
import { updateLock } from './util/lock'
import FloatingEditor, { toggleEditor } from './util/floatingEditor'
import { swapSelection, clearSelection, selectionCount } from './util/selection'
import { isLittleSisId } from './util/helpers'
import { newEdgeFromNodes } from './graph/edge'

const ZOOM_INTERVAL = 1.2

interface ActionType {
  type: string;
  [x: string | symbol]: any;
}

export default produce( (state: State, action: ActionType): void => {
  switch(action.type) {
    case 'SET_SAVED_DATA':
      state.lastSavedData = action.data
      return

      // Annotations

    case 'CREATE_ANNOTATION':
      createAnnotation(state.annotations)
      return
    case 'MOVE_ANNOTATION':
      moveAnnotation(state.annotations, action.from, action.to)
      return
    case 'SHOW_ANNOTATION':
      showAnnotation(state.annotations, action.index)
      return
    case 'UPDATE_ANNOTATION':
      updateAnnotation(state.annotations, action.id, action.attributes)
      return
    case 'CLEAR_HIGHLIGHTS':
      clearHighlights(state.annotations)
      return
    case 'REMOVE_ANNOTATION':
      removeAnnotation(state.annotations, action.id)
      return
    case 'SET_HIGHLIGHTING':
      state.annotations.isHighlighting = action.isHighlighting
      return
    case 'SWAP_NODE_HIGHLIGHT':
      swapHighlight(state.annotations, 'node', action.id)
      return
    case 'SWAP_EDGE_HIGHLIGHT':
      swapHighlight(state.annotations, 'edge', action.id)
      return
    case 'SWAP_CAPTION_HIGHLIGHT':
      swapHighlight(state.annotations, 'caption', action.id)
      return
    case 'SET_EDITOR_MODE':
      state.annotations.currentIndex = 0
      clearSelection(state.display)
      state.display.tool = null
      FloatingEditor.clear(state.display)
      state.display.modes.editor = action.enabled
      return
    case 'TOGGLE_STATE.ANNOTATIONS':
      state.annotations.isHighlighting = false
      return

      // Graph

    case 'ADD_NODE':
      addNode(state.graph, action.node, action.position || true)

      if (!isLittleSisId(action.node.id)) {
        toggleEditor(state.display, 'node', action.node.id)
      }

      return
    case 'UPDATE_NODE':
      updateNode(state.graph, action.id, action.attributes)
      return
    case 'UPDATE_NODES':
      action.nodeIds.forEach((nodeId: string) => {
        updateNode(state.graph, nodeId, action.attributes)
      })
      return
    case 'REMOVE_NODE':
      removeNode(state.graph, action.id)
      FloatingEditor.clear(state.display)
      swapSelection(state.display, 'node', action.id)
      return
    case 'REMOVE_NODES':
      removeNodes(state.graph, action.ids)
      clearSelection(state.display)
      return
    case 'CLICK_NODE':
      // if shift key is held, action is a selection
      if (action.shiftKey) {
        let indexOfNode = state.display.selection.node.indexOf(action.id)
        if (indexOfNode === -1) {
          state.display.selection.node.push(action.id)
        } else {
          state.display.selection.node.splice(indexOfNode)
        }
      } else {
        state.display.selection.node = [action.id]
        toggleEditor(state.display, 'node', action.id)
        // select node if editing it
        // if (FloatingEditor.getId(state.display, 'node') === action.id) {
        //   swapSelection(state.display, 'node', action.id)
        // }
      }
      return
    case 'MOUSE_ENTERED_NODE':
      console.log(`MOUSE ENTERED ${state.graph.nodes[action.id].name}`)
      state.display.overNode = action.id

      if (state.display.modes.editor && state.display.draggedNode && state.display.draggedNode !== action.id) {
        const draggedNodeName = state.graph.nodes[state.display.draggedNode].name
        const hoveringName = state.graph.nodes[action.id].name

        state.display.userMessage = `Drop node to create new edge between ${draggedNodeName} and ${hoveringName}`
      }
      return
    case 'MOUSE_LEFT_NODE':
      console.log(`MOUSE LEFT ${state.graph.nodes[action.id].name}`)
      state.display.overNode = null
      state.display.userMessage = null
      return

    case 'DRAG_NODE_START':
      clearSelection(state.display)
      state.display.selection.node = [action.id]
      if (state.display.overNode === action.id) {
        state.display.overNode = null
      }
      FloatingEditor.clear(state.display)
      state.display.draggedNode = action.id
      return
    case 'DRAG_NODE':
      dragNodeEdges(state.graph, action.id, action.deltas)
      return
    case 'DRAG_NODE_STOP':
      if (state.display.modes.editor) {
        // When dragging over another node create a new edge
        if (state.display.overNode && state.display.overNode !== action.id) {
          const node1 = state.graph.nodes[action.id]
          const node2 = state.graph.nodes[state.display.overNode]

          const edge = newEdgeFromNodes(node1, node2)
          // check if there already exists and eges between these nodes
          const nodeIds = new Set([edge.node1_id, edge.node2_id])
          const similarEdges = Object.values(state.graph.edges).filter(function(e) {
            return isEqual(new Set([e.node1_id, e.node2_id]), nodeIds)
          })

          // if there are existing edges
          if (similarEdges.length > 0) {
            // delete them
            similarEdges.forEach(e => removeEdge(state.graph, e.id))
            // change the curves and return graph with new edge
            curveSimilarEdges(similarEdges.concat([edge])).forEach(e => addEdge(state.graph, e))
          } else {
            addEdge(state.graph, edge)
          }
          // Otherwise move the node to the new position
        } else {
          moveNode(state.graph, action.id, action.deltas)
          clearSelection(state.display)
        }

        // update the edges for this node
        dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })
      }

      state.display.draggedNode = null
      return
    case 'ADD_EDGE':
      addEdgeIfNodes(state.graph, action.edge)
      dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })

      if (!isLittleSisId(action.edge.id)) {
        toggleEditor(state.display, 'edge', action.edge.id)
      }

      return
    case 'ADD_EDGES':
      addEdgesIfNodes(state.graph, action.edges)
      return
    case 'UPDATE_EDGE':
      updateEdge(state.graph, action.id, action.attributes)
      return
      // Reserving "DELETE" for future ability to delete data from littlesis backend
    case 'REMOVE_EDGE':
      removeEdge(state.graph, action.id)
      FloatingEditor.clear(state.display)
      return
    case 'ADD_CAPTION':
      addCaption(state.graph, merge(
        Caption.fromEvent(action.event),
        { id: action.id }
      ))

      toggleEditor(state.display, 'caption', action.id)
      return
    case 'UPDATE_CAPTION':
      merge(state.graph.captions[action.id], action.attributes)
      return
    case 'MOVE_CAPTION':
      merge(state.graph.captions[action.id], translatePoint(state.graph.captions[action.id], action.deltas))
      return
    case 'REMOVE_CAPTION':
      delete state.graph.captions[action.id]
      FloatingEditor.clear(state.display)
      return
    case 'APPLY_FORCE_LAYOUT':
      state.graph = action.graph
      state.display.userMessage = null
      return
    case 'INTERLOCKS_SUCCESS':
      addInterlocks(state.graph, action.node1Id, action.node2Id, action.nodes, action.edges)
      state.display.userMessage = action.nodes.length > 0 ? `Fetched ${action.nodes.length} interlocks` : 'No interlocks found'
      return

      // Display

    case 'SET_SVG_TOP':
      state.display.svgTop = action.svgTop
      return
    case 'SET_SVG_BOTTOM':
      state.display.svgBottom = action.svgBottom
      return
    case 'SET_SVG_WIDTH':
      state.display.svgSize.width = action.width
      return
    case 'SET_SVG_HEIGHT':
      state.display.svgSize.height = action.height
      return
    case 'SET_ACTUAL_ZOOM':
      state.display.actualZoom = action.actualZoom
      return
    case 'SET_SVG_ZOOM':
      state.display.svgZoom = action.svgZoom
      return
    case 'SET_OFFSET':
      state.display.offset = action.offset
      return
    case 'SET_SVG_OFFSET':
      state.display.svgOffset = action.svgOffset
      return
    case 'SET_VIEWBOX':
      state.display.viewBox = action.viewBox
      return
    case 'RESET_VIEW':
      state.display.offset = { x: 0, y: 0}
      state.display.zoom = 1
      return
    case 'COLLAPSE_HEADER':
      state.display.headerIsCollapsed = true
      return
    case 'EXPAND_HEADER':
      state.display.headerIsCollapsed = false
      return
    // case 'RELEASE_NODE':
    //   state.display.userMessage = null
    //   state.display.draggedNode = null
    //   return
    case 'CLICK_EDGE':
      clearSelection(state.display)
      toggleEditor(state.display, 'edge', action.id)
      return
    case 'CLICK_CAPTION':
      clearSelection(state.display)
      toggleEditor(state.display, 'caption', action.id)
      return
    case 'ZOOM_IN':
      state.display.zoom = state.display.zoom * (action.interval || ZOOM_INTERVAL)
      return
    case 'ZOOM_OUT':
      state.display.zoom = state.display.zoom / (action.interval || ZOOM_INTERVAL)
      return
    case 'SET_ZOOM':
      state.display.zoom = action.zoom
      return
    case 'TOGGLE_ANNOTATIONS':
      state.display.modes.story = !state.display.modes.story
      return
    case 'HIDE_ANNOTATIONS':
      state.display.modes.story = false
      return
    case 'SHOW_ANNOTATIONS':
      state.display.modes.story = true
      return
    case 'HIDE_HEADER':
      state.display.showHeader = false
      return
    case 'SHOW_HEADER':
      state.display.showHeader = true
      return
    case 'HIDE_ZOOM_CONTROL':
      state.display.showZoomControl = false
      return
    case 'SHOW_ZOOM_CONTROL':
      state.display.showZoomControl = true
      return
    case 'TOGGLE_TOOL':
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

      return
    case 'CLOSE_TOOL':
      state.display.tool = null
      return
    case 'OPEN_ADD_CONNECTIONS':
      if (isLittleSisId(action.id)) {
        FloatingEditor.set(state.display, 'connections', action.id)
      } else {
        console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
      }
      return
    case 'CLOSE_EDITOR':
      FloatingEditor.clear(state.display)
      return
    case 'OPEN_EDTIOR':
      FloatingEditor.set(state.display, action.editorType, action.id)
      return
      // Save map actions
    case 'SAVE_REQUESTED':
      state.display.saveMapStatus = 'REQUESTED'
      state.display.userMessage = 'Saving map...'
      return
    case 'SAVE_SUCCESS':
      if (!state.attributes.id) {
        state.attributes.id = action.id
      }

      state.display.saveMapStatus = 'SUCCESS'
      state.display.userMessage = 'Saved map :)'
      return
    case 'SAVE_FAILED':
      state.display.saveMapStatus = 'FAILED'
      state.display.userMessage = 'Failed to save map :('
      return
    case 'SAVE_RESET':
      state.display.saveMapStatus = null
      state.display.userMessage = null
      return
      // Clone map actions
    case 'CLONE_REQUESTED':
      state.display.cloneMapStatus = 'REQUESTED'
      state.display.userMessage = 'Cloning map...'
      return
    case 'CLONE_SUCCESS':
      state.display.cloneMapStatus = 'SUCCESS'
      state.display.userMessage = 'Cloned map :)'
      return
    case 'CLONE_FAILED':
      state.display.cloneMapStatus = 'FAILED'
      state.display.userMessage = 'Failed to clone map :('
      return
    case 'CLONE_RESET':
      state.display.cloneMapStatus = null
      state.display.userMessage = null
      return
      // Clone map actions
    case 'DELETE_REQUESTED':
      state.display.deleteMapStatus = 'REQUESTED'
      state.display.userMessage = 'Deleting map...'
      return
    case 'DELETE_SUCCESS':
      state.display.deleteMapStatus = 'SUCCESS'
      state.display.userMessage = 'Deleted map :)'
      return
    case 'DELETE_FAILED':
      state.display.deleteMapStatus = 'FAILED'
      state.display.userMessage = 'Failed to delete map :('
      return
    case 'DELETE_RESET':
      state.display.cloneMapStatus = null
      state.display.userMessage = null
      return
    case 'FORCE_LAYOUT_REQUESTED':
      state.display.userMessage = 'Generating force-directed layout...'
      return
    case 'ADD_EDITOR_REQUESTED':
      state.display.userMessage = 'Adding editor...'
      return
    case 'ADD_EDITOR_SUCCESS':
      state.display.userMessage = 'Added editor :)'
      return
    case 'ADD_EDITOR_FAILED':
      state.display.userMessage = 'Failed to add editor :('
      return
    case 'ADD_EDITOR_RESET':
      state.display.userMessage = null
      return
    case 'REMOVE_EDITOR_REQUESTED':
      state.display.userMessage = 'Removing editor...'
      return
    case 'REMOVE_EDITOR_FAILED':
      state.display.userMessage = 'Failed to remove editor :('
      return
    case 'REMOVE_EDITOR_RESET':
      state.display.userMessage = null
      return
    case 'INTERLOCKS_REQUESTED':
      state.display.userMessage = 'Fetching interlocks...'
      return
    case 'INTERLOCKS_FAILED':
      state.display.userMessage = 'Failed to fetch interlocks :('
      return
    case 'INTERLOCKS_RESET':
      state.display.userMessage = null
      return
    case 'LOCK_TAKEOVER_REQUESTED':
      state.display.userMessage = 'Taking over map lock...'
      return
    case 'LOCK_TAKEOVER_SUCCESS':
      state.display.userMessage = 'Took over map lock :)'
      return
    case 'LOCK_TAKEOVER_FAILED':
      state.display.userMessage = 'Failed to take over map lock :('
      return
    case 'LOCK_TAKEOVER_RESET':
      state.display.userMessage = null
      return
    case 'LOCK_RELEASE_REQUESTED':
      state.display.userMessage = 'Releasing map lock...'
      return
    case 'LOCK_RELEASE_SUCCESS':
      state.display.userMessage = 'Released map lock :)'
      return
    case 'LOCK_RELEASE_FAILED':
      state.display.userMessage = 'Failed to release map lock :('
      return
    case 'LOCK_RELEASE_RESET':
      state.display.userMessage = null
      return
    case 'EXPORT_IMAGE_REQUESTED':
      state.display.userMessage = 'Exporting...'
      return
    case 'EXPORT_IMAGE_SUCCESS':
      state.display.userMessage = 'Exported map to JPG :)'
      return
    case 'EXPORT_IMAGE_FAILED':
      state.display.userMessage = 'Failed to export :('
      return
    case 'EXPORT_IMAGE_RESET':
      state.display.userMessage = null
      return
    case 'SET_SELECTING':
      state.display.selection.isSelecting = action.isSelecting
      return
    case 'SWAP_NODE_SELECTION':
      swapSelection(
        state.display,
        'node',
        action.id,
        Boolean(action.singleSelect)
      )
      FloatingEditor.clear(state.display)
      return
    case 'CLEAR_SELECTION':
      clearSelection(state.display)
      return
    case 'UPDATE_ATTRIBUTE':
      state.attributes[action.name] = action.value
      return
    case 'UPDATE_SETTING':
      updateSetting(state.attributes, action.key, action.value)
      return
    case 'REMOVE_EDITOR_SUCCESS':
      state.attributes.editors = action.editors
      state.display.userMessage = 'Removed editor'
      return

    case 'SET_LOCK':
      state.attributes.lock = updateLock(state.attributes.lock, action.lock)

      if (action.lock.editors) {
        state.attributes.editors = action.lock.editors
      }

      return
    default:
      return
  }

}, null)
