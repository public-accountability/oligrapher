import type { ActionReducerMapBuilder } from "@reduxjs/toolkit"

import merge from "lodash/merge"
import without from "lodash/without"
import isEqual from "lodash/isEqual"
import clamp from "lodash/clamp"
import cloneDeep from "lodash/cloneDeep"

import {
  addNode,
  updateNode,
  removeNode,
  removeNodes,
  dragNodeEdges,
  moveNode,
  addEdgeIfNodes,
  addEdgesIfNodes,
  updateEdge,
  removeEdge,
  addCaption,
  addEdge,
  calculateViewBoxFromGraph,
} from "./graph/graph"

import { addInterlocks, addInterlocks2 } from "./graph/interlocks"
import { newEdgeFromNodes } from "./graph/edge"
import { curveSimilarEdges } from "./graph/curve"
import Caption from "./graph/caption"
import type { State } from "./util/defaultState"

import {
  createAnnotation,
  moveAnnotation,
  showAnnotation,
  updateAnnotation,
  removeAnnotation,
  swapHighlight,
  clearHighlights,
} from "./util/annotations"

import updateSetting from "./util/updateSetting"
import { Point, polygonCenter, translatePoint } from "./util/geometry"
import FloatingEditor from "./util/floatingEditor"
import { swapSelection, clearSelection, selectionCount } from "./util/selection"
import { getElementForGraphItem, isLittleSisId } from "./util/helpers"
import { calculateSvgHeight, calculateSvgScale, zoomForScale } from "./util/dimensions"

const ZOOM_INTERVAL = 1.2

const ACTION_TO_MESSAGE = {
  FORCE_LAYOUT_REQUESTED: "Generating force-directed layout...",
  ADD_EDITOR_REQUESTED: "Adding editor...",
  ADD_EDITOR_SUCCESS: "Added editor",
  ADD_EDITOR_FAILED: "Failed to add editor",
  ADD_EDITOR_RESET: null,
  REMOVE_EDITOR_REQUESTED: "Removing editor...",
  REMOVE_EDITOR_FAILED: "Failed to remove editor",
  REMOVE_EDITOR_RESET: null,
  INTERLOCKS_REQUESTED: "Fetching interlocks...",
  INTERLOCKS_FAILED: "Failed to fetch interlocks",
  INTERLOCKS_RESET: null,
  // LOCK_TAKEOVER_REQUESTED: "Taking over map lock...",
  // LOCK_TAKEOVER_SUCCESS: "Took over map lock",
  // LOCK_TAKEOVER_FAILED: "Failed to take over map lock",
  // LOCK_TAKEOVER_RESET: null,
  // LOCK_RELEASE_REQUESTED: "Releasing map lock...",
  // LOCK_RELEASE_SUCCESS: "Released map lock",
  // LOCK_RELEASE_FAILED: "Failed to release map lock",
  // LOCK_RELEASE_RESET: null,
  EXPORT_IMAGE_REQUESTED: "Exporting...",
  EXPORT_IMAGE_SUCCESS: "Exported map",
  EXPORT_IMAGE_FAILED: "Failed to export",
  EXPORT_IMAGE_RESET: null,
}

const MESSAGE_ACTIONS = new Set(Object.keys(ACTION_TO_MESSAGE))

function moveNodeAndEdges(state: State, id: string, deltas: Point): void {
  moveNode(state.graph, id, deltas)
  dragNodeEdges(state.graph, id, { x: 0, y: 0 })
}

function hasOtherSelectedNodes(state: State, id: string): boolean {
  return state.display.selection.node.length > 0 && !isEqual(state.display.selection.node, [id])
}

function loopOtherSelectedNodes(state: State, thisNode: string, action: (nodeId: string) => void) {
  state.display.selection.node.forEach(nodeId => {
    if (nodeId !== thisNode) {
      action(nodeId)
    }
  })
}

function addToPastHistory(state: State): void {
  state.history.past.unshift(cloneDeep(state.graph))
}

// Closing the tools after UNDO/REDO avoids errors that can
// happen if the open editors have stale data
function closeToolAndFloatingEditor(state: State): void {
  state.display.tool = null
  state.display.openCaption = null
  state.display.floatingEditor.type = null
  state.display.floatingEditor.id = null
}

function zoomOutIfMaxScale(state: State) {
  const maxScale = 2.9
  const currentScale = calculateSvgScale(state.display.zoom)
  if (currentScale > maxScale) {
    const zoom = zoomForScale(maxScale)
    state.display.zoom = zoom
    state.display.svgScale = calculateSvgScale(zoom)
  }
}

const builderCallback = (builder: ActionReducerMapBuilder<State>) => {
  builder.addCase("HISTORY_UNDO", (state, action) => {
    if (state.history.past.length > 0) {
      state.history.future.unshift(cloneDeep(state.graph))
      state.graph = cloneDeep(state.history.past.shift())
    } else {
      console.error("no past history found")
    }

    closeToolAndFloatingEditor(state)
  })

  builder.addCase("HISTORY_REDO", (state, action) => {
    if (state.history.future.length > 0) {
      state.history.past.unshift(cloneDeep(state.graph))
      state.graph = cloneDeep(state.history.future.shift())
    } else {
      console.error("no future history found")
    }

    closeToolAndFloatingEditor(state)
  })

  builder.addCase("SET_SAVED_DATA", (state, action) => {
    state.lastSavedData = action.data
  })

  builder.addCase("CREATE_ANNOTATION", (state, action) => {
    createAnnotation(state.annotations)
  })

  builder.addCase("MOVE_ANNOTATION", (state, action) => {
    moveAnnotation(state.annotations, action.from, action.to)
  })

  builder.addCase("SHOW_ANNOTATION", (state, action) => {
    showAnnotation(state.annotations, action.index)
  })

  builder.addCase("UPDATE_ANNOTATION", (state, action) => {
    updateAnnotation(state.annotations, action.id, action.attributes)
  })

  builder.addCase("CLEAR_HIGHLIGHTS", (state, action) => {
    clearHighlights(state.annotations)
  })

  builder.addCase("REMOVE_ANNOTATION", (state, action) => {
    removeAnnotation(state.annotations, action.id)
  })

  builder.addCase("SET_HIGHLIGHTING", (state, action) => {
    state.annotations.isHighlighting = action.isHighlighting
  })

  builder.addCase("SWAP_NODE_HIGHLIGHT", (state, action) => {
    swapHighlight(state.annotations, "node", action.id)
  })

  builder.addCase("SWAP_EDGE_HIGHLIGHT", (state, action) => {
    swapHighlight(state.annotations, "edge", action.id)
  })

  builder.addCase("SET_EDITOR_MODE", (state, action) => {
    state.annotations.currentIndex = 0
    clearSelection(state.display)
    state.display.tool = null
    FloatingEditor.clear(state.display)
    state.display.modes.editor = action.enabled
  })

  builder.addCase("ADD_NODE", (state, action) => {
    addToPastHistory(state)

    addNode(state.graph, action.node, action.position)

    if (!isLittleSisId(action.node.id)) {
      FloatingEditor.toggleEditor(state.display, "node", action.node.id)
    }
  })

  builder.addCase("UPDATE_NODE", (state, action) => {
    addToPastHistory(state)
    updateNode(state.graph, action.id, action.attributes)
  })

  builder.addCase("UPDATE_NODES", (state, action) => {
    addToPastHistory(state)
    action.nodeIds.forEach((nodeId: string) => {
      updateNode(state.graph, nodeId, action.attributes)
    })
  })

  builder.addCase("REMOVE_NODE", (state, action) => {
    addToPastHistory(state)
    removeNode(state.graph, action.id)
    FloatingEditor.clear(state.display)
    swapSelection(state.display, "node", action.id)
  })

  builder.addCase("REMOVE_NODES", (state, action) => {
    addToPastHistory(state)
    removeNodes(state.graph, action.ids)
    clearSelection(state.display)
  })

  builder.addCase("CLICK_NODE", (state, action) => {
    // Remove history entry from DRAG_NODE_STOP
    state.history.past.pop()
    // Because CLICK_NODE is triggered instead of MOVE_NODE by DraggableComponent
    // and can happen after small (< 5) movement we still need call this function
    moveNodeAndEdges(state, action.id, action.deltas || { x: 0, y: 0 })

    // If we are editing annotations and holding down the control key
    if (state.display.modes.editor && state.display.modes.story && action.ctrlKey) {
      if (state.annotations.list[state.annotations.currentIndex].nodeIds.includes(action.id)) {
        state.annotations.list[state.annotations.currentIndex].nodeIds = without(
          state.annotations.list[state.annotations.currentIndex].nodeIds,
          action.id
        )
      } else {
        state.annotations.list[state.annotations.currentIndex].nodeIds.push(action.id)
      }
    } else {
      // if shift key is on, action is to add or remove node from selection
      if (action.shiftKey) {
        if (state.display.selection.node.includes(action.id)) {
          state.display.selection.node = without(state.display.selection.node, action.id)
        } else {
          state.display.selection.node.push(action.id)
        }
        FloatingEditor.clear(state.display)
      } else {
        if (
          state.display.floatingEditor.type === "node" &&
          state.display.floatingEditor.id === action.id
        ) {
          // remove selection and close editor
          state.display.selection.node = without(state.display.selection.node, action.id)
          FloatingEditor.clear(state.display)
        } else if (state.display.selection.node.includes(action.id)) {
          FloatingEditor.toggleEditor(state.display, "node", action.id)
        } else {
          state.display.selection.node = [action.id]
          FloatingEditor.toggleEditor(state.display, "node", action.id)
        }
      }
    }
  })

  builder.addCase("MOUSE_ENTERED_NODE", (state, action) => {
    state.display.overNode = action.id

    if (
      state.display.modes.editor &&
      state.display.draggedNode &&
      state.display.draggedNode !== action.id
    ) {
      const draggedNodeName = state.graph.nodes[state.display.draggedNode].name
      const hoveringName = state.graph.nodes[action.id].name

      state.display.userMessage = `Drop node to create new edge between ${draggedNodeName} and ${hoveringName}`
    }
  })

  builder.addCase("MOUSE_LEFT_NODE", (state, action) => {
    state.display.overNode = null
    state.display.userMessage = null
  })

  builder.addCase("DRAG_NODE_START", (state, action) => {
    addToPastHistory(state)
    state.display.draggedNode = action.id
  })

  builder.addCase("DRAG_NODE_STOP", (state, action) => {
    state.display.draggedNode = null
  })

  builder.addCase("DRAG_NODE", (state, action) => {
    dragNodeEdges(state.graph, action.id, action.deltas)
    if (hasOtherSelectedNodes(state, action.id)) {
      loopOtherSelectedNodes(state, action.id, nodeId => {
        dragNodeEdges(state.graph, nodeId, action.deltas)
        getElementForGraphItem(nodeId, "node").setAttribute("transform", action.transform)
      })
    }
  })

  builder.addCase("MOVE_NODE_OR_ADD_EDGE_FROM_DRAG", (state, action) => {
    // When dragging over another node create a new edge
    if (state.display.overNode && state.display.overNode !== action.id) {
      const node1 = state.graph.nodes[action.id]
      const node2 = state.graph.nodes[state.display.overNode]

      const edge = newEdgeFromNodes(node1, node2)
      // are there already edges between these two nodes?
      const nodeIds = new Set([edge.node1_id, edge.node2_id])
      const similarEdges = Object.values(state.graph.edges).filter(e =>
        isEqual(new Set([e.node1_id, e.node2_id]), nodeIds)
      )
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
      // reset other selected nodes
      if (hasOtherSelectedNodes(state, action.id)) {
        loopOtherSelectedNodes(state, action.id, nodeId => {
          dragNodeEdges(state.graph, nodeId, { x: 0, y: 0 })
          getElementForGraphItem(nodeId, "node").setAttribute("transform", "translate(0,0)")
        })
      }
      // Otherwise move the node moveNodeAndEdges(state, nodeId, action.deltas)
    } else {
      moveNodeAndEdges(state, action.id, action.deltas)
      // and move other selected nodes
      if (hasOtherSelectedNodes(state, action.id)) {
        loopOtherSelectedNodes(state, action.id, nodeId => {
          moveNodeAndEdges(state, nodeId, action.deltas)
          getElementForGraphItem(nodeId, "node").setAttribute("transform", "translate(0,0)")
        })
      }
    }
  })

  builder.addCase("ADD_EDGE", (state, action) => {
    addToPastHistory(state)
    addEdgeIfNodes(state.graph, action.edge)
    dragNodeEdges(state.graph, action.id, { x: 0, y: 0 })

    if (!isLittleSisId(action.edge.id)) {
      FloatingEditor.toggleEditor(state.display, "edge", action.edge.id)
    }
  })

  builder.addCase("ADD_EDGES", (state, action) => {
    addToPastHistory(state)
    addEdgesIfNodes(state.graph, action.edges)
  })

  builder.addCase("UPDATE_EDGE", (state, action) => {
    addToPastHistory(state)
    updateEdge(state.graph, action.id, action.attributes)
  })

  builder.addCase("REMOVE_EDGE", (state, action) => {
    addToPastHistory(state)
    removeEdge(state.graph, action.id)
    FloatingEditor.clear(state.display)
  })

  builder.addCase("MOUSE_ENTERED_CAPTION", (state, action) => {
    state.display.overCaption = action.id
  })

  builder.addCase("MOUSE_LEFT_CAPTION", (state, action) => {
    state.display.overCaption = null
  })

  builder.addCase("ADD_CAPTION", (state, action) => {
    addToPastHistory(state)
    addCaption(state.graph, action.caption)
  })

  builder.addCase("UPDATE_CAPTION", (state, action) => {
    addToPastHistory(state)
    merge(state.graph.captions[action.id], action.attributes)
  })

  builder.addCase("MOVE_CAPTION", (state, action) => {
    addToPastHistory(state)
    merge(
      state.graph.captions[action.id],
      translatePoint(state.graph.captions[action.id], action.deltas)
    )
  })

  builder.addCase("RESIZE_CAPTION", (state, action) => {
    state.graph.captions[action.id].width = action.width
    state.graph.captions[action.id].height = action.height
  })

  builder.addCase("REMOVE_CAPTION", (state, action) => {
    addToPastHistory(state)

    if (state.display.openCaption === action.id) {
      state.display.openCaption = null
    }

    if ((state.display.overCaption = action.id)) {
      state.display.overCaption = null
    }

    delete state.graph.captions[action.id]
  })

  builder.addCase("APPLY_FORCE_LAYOUT", (state, action) => {
    state.graph = action.graph
    state.display.userMessage = null
  })

  builder.addCase("INTERLOCKS_SUCCESS", (state, action) => {
    if (action.nodes.length > 0) {
      addToPastHistory(state)
    }

    addInterlocks(
      state.graph,
      action.selectedNodes[0],
      action.selectedNodes[1],
      action.nodes,
      action.edges
    )
    state.display.userMessage =
      action.nodes.length > 0 ? `Fetched ${action.nodes.length} interlocks` : "No interlocks found"
  })

  builder.addCase("INTERLOCKS_REQUESTED_2", (state, action) => {
    state.display.interlocks.status = "REQUESTED"
    state.display.interlocks.selectedNodes = action.selectedNodes
    state.display.interlocks.nodes = null
    state.display.interlocks.edges = null
  })

  builder.addCase("INTERLOCKS_SUCCESS_2", (state, action) => {
    // addToPastHistory(state)
    state.display.interlocks.status = "SUCCESS"
    state.display.interlocks.selectedNodes = action.selectedNodes
    state.display.interlocks.nodes = action.nodes
    state.display.interlocks.edges = action.edges
    state.display.userMessage =
      action.nodes.length > 0 ? `Found ${action.nodes.length} interlocks` : "No interlocks found"
  })

  builder.addCase("INTERLOCKS_FAILED_2", (state, action) => {
    state.display.interlocks.status = "FAILED"
    state.display.userMessage = "Interlocks request failed"
  })

  builder.addCase("INTERLOCKS_RESET_2", (state, action) => {
    state.display.interlocks.status = null
    state.display.userMessage = null
  })

  builder.addCase("ADD_ALL_INTERLOCKS", (state, action) => {
    addToPastHistory(state)
    const center = polygonCenter(
      Object.values(state.graph.nodes).filter(n =>
        state.display.interlocks.selectedNodes.includes(n.id)
      )
    )

    state.display.interlocks.nodes.forEach(lsNode => {
      addNode(state.graph, lsNode, center)
    })

    addEdgesIfNodes(state.graph, state.display.interlocks.edges)

    state.display.selection.node = []
    state.display.interlocks.selectedNodes = null
    state.display.interlocks.nodes = null
    state.display.interlocks.edges = null
  })

  builder.addCase("ADD_INTERLOCKS_NODE", (state, action) => {})

  builder.addCase("RESET_VIEW", (state, action) => {
    state.display.svgHeight = calculateSvgHeight()
    state.display.viewBox = calculateViewBoxFromGraph(state.graph)

    // if (state.display.viewBox.h < state.display.svgHeight) {
    //   state.display.viewBox.h = state.display.svgHeight
    // }

    state.display.zoom = 1
    state.display.svgScale = calculateSvgScale(state.display.zoom)
    zoomOutIfMaxScale(state)
  })

  builder.addCase("CLICK_EDGE", (state, action) => {
    if (state.display.modes.editor && state.display.modes.story && action.ctrlKey) {
      if (state.annotations.list[state.annotations.currentIndex].edgeIds.includes(action.id)) {
        state.annotations.list[state.annotations.currentIndex].edgeIds = without(
          state.annotations.list[state.annotations.currentIndex].edgeIds,
          action.id
        )
      } else {
        state.annotations.list[state.annotations.currentIndex].edgeIds.push(action.id)
      }
    } else {
      clearSelection(state.display)
      FloatingEditor.toggleEditor(state.display, "edge", action.id)
    }
  })

  builder.addCase("REMOVE_OPEN_CAPTION", (state, action) => {
    state.display.openCaption = null
  })

  builder.addCase("CLICK_CAPTION", (state, action) => {
    if (state.display.openCaption === action.id) {
      state.display.openCaption = null
    } else {
      if (state.display.tool === "text") {
        state.display.openCaption = action.id
      }
    }
  })

  builder.addCase("CLICK_BACKGROUND", (state, action) => {
    if (
      state.display.tool === "text" &&
      !state.display.openCaption &&
      !state.display.overCaption &&
      !state.display.overNode
    ) {
      const caption = Caption.new({ text: "New Caption", ...action.point })
      addCaption(state.graph, caption)
      state.display.openCaption = caption.id
    }
  })

  builder.addCase("ZOOM_IN", (state, action) => {
    state.display.zoom = state.display.zoom * (action.interval || ZOOM_INTERVAL)
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("ZOOM_OUT", (state, action) => {
    state.display.zoom = state.display.zoom / (action.interval || ZOOM_INTERVAL)
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("TOGGLE_ANNOTATIONS", (state, action) => {
    state.display.modes.story = !state.display.modes.story
  })

  builder.addCase("HIDE_ANNOTATIONS", (state, action) => {
    state.display.modes.story = false
  })

  builder.addCase("SHOW_ANNOTATIONS", (state, action) => {
    state.display.modes.story = true
  })

  builder.addCase("TOGGLE_TOOL", (state, action) => {
    const prevTool = state.display.tool
    state.display.tool = state.display.tool === action.tool ? null : action.tool

    // if new tool has been opened
    if (state.display.tool && state.display.tool !== prevTool) {
      // close floating editor
      FloatingEditor.clear(state.display)

      // clear single selection
      if (selectionCount(state.display) === 1) {
        clearSelection(state.display)
      }
    }
    if (prevTool === "text") {
      state.display.openCaption = null
    }
  })

  builder.addCase("CLOSE_TOOL", (state, action) => {
    if (state.display.tool === "text") {
      state.display.openCaption = null
    }
    state.display.tool = null
  })

  builder.addCase("OPEN_ADD_CONNECTIONS", (state, action) => {
    if (isLittleSisId(action.id)) {
      FloatingEditor.set(state.display, "connections", action.id)
    } else {
      console.error(
        `Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`
      )
    }
  })

  builder.addCase("CLOSE_EDITOR", (state, action) => {
    FloatingEditor.clear(state.display)
  })

  builder.addCase("OPEN_EDTIOR", (state, action) => {
    FloatingEditor.set(state.display, action.editorType, action.id)
  })

  builder.addCase("SAVE_REQUESTED", (state, action) => {
    state.display.saveMapStatus = "REQUESTED"
    state.display.userMessage = "Saving map..."
  })

  builder.addCase("SAVE_SUCCESS", (state, action) => {
    if (!state.attributes.id) {
      state.attributes.id = action.id
    }

    state.display.saveMapStatus = "SUCCESS"
    state.display.userMessage = "Saved map :)"
  })

  builder.addCase("SAVE_FAILED", (state, action) => {
    state.display.saveMapStatus = "FAILED"
    state.display.userMessage = "Failed to save map :("
  })

  builder.addCase("SAVE_RESET", (state, action) => {
    state.display.saveMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase("CLONE_REQUESTED", (state, action) => {
    state.display.cloneMapStatus = "REQUESTED"
    state.display.userMessage = "Cloning map..."
  })

  builder.addCase("CLONE_SUCCESS", (state, action) => {
    state.display.cloneMapStatus = "SUCCESS"
    state.display.userMessage = "Cloned map :)"
  })

  builder.addCase("CLONE_FAILED", (state, action) => {
    state.display.cloneMapStatus = "FAILED"
    state.display.userMessage = "Failed to clone map :("
  })

  builder.addCase("CLONE_RESET", (state, action) => {
    state.display.cloneMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase("DELETE_REQUESTED", (state, action) => {
    state.display.deleteMapStatus = "REQUESTED"
    state.display.userMessage = "Deleting map..."
  })

  builder.addCase("DELETE_SUCCESS", (state, action) => {
    state.display.deleteMapStatus = "SUCCESS"
    state.display.userMessage = "Deleted map :)"
  })

  builder.addCase("DELETE_FAILED", (state, action) => {
    state.display.deleteMapStatus = "FAILED"
    state.display.userMessage = "Failed to delete map :("
  })

  builder.addCase("DELETE_RESET", (state, action) => {
    state.display.cloneMapStatus = null
    state.display.userMessage = null
  })

  builder.addCase("SET_SELECTING", (state, action) => {
    state.display.selection.isSelecting = action.isSelecting
  })

  builder.addCase("SWAP_NODE_SELECTION", (state, action) => {
    swapSelection(state.display, "node", action.id, Boolean(action.singleSelect))
    FloatingEditor.clear(state.display)
  })

  builder.addCase("CLEAR_SELECTION", (state, action) => {
    clearSelection(state.display)
  })

  builder.addCase("UPDATE_ATTRIBUTE", (state, action) => {
    state.attributes[action.name] = action.value
  })

  builder.addCase("UPDATE_SETTING", (state, action) => {
    updateSetting(state.attributes, action.key, action.value)
    addToPastHistory(state)
  })

  builder.addCase("REMOVE_EDITOR_SUCCESS", (state, action) => {
    state.attributes.editors = action.editors
    state.display.userMessage = "Removed editor"
  })

  builder.addCase("SET_LOCK", (state, action) => {
    state.display.lock = action.lock
  })

  builder.addCase("CHANNEL_SUBSCRIBED", (state, action) => {})

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
  builder.addCase("SET_ZOOM_FROM_SCROLL", (state, action) => {
    state.display.zoom = clamp(state.display.zoom + action.deltaY * -0.01, 0.25, 10)
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("SET_SVG_SCALE", (state, action) => {
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("ADJUST_SVG_SCALE", (state, action) => {
    zoomOutIfMaxScale(state)
  })

  builder.addCase("SET_SVG_HEIGHT", (state, action) => {
    state.display.svgHeight = calculateSvgHeight()
  })

  builder.addCase("SET_VIEWBOX", (state, action) => {
    state.display.viewBox = action.viewBox
  })

  builder.addCase("COLLAPSE_HEADER", (state, action) => {
    state.display.headerIsCollapsed = true
    state.display.svgHeight = calculateSvgHeight()
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("EXPAND_HEADER", (state, action) => {
    state.display.headerIsCollapsed = false
    state.display.svgHeight = calculateSvgHeight()
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("SET_ZOOM", (state, action) => {
    state.display.zoom = action.zoom
    state.display.svgScale = calculateSvgScale(state.display.zoom)
  })

  builder.addCase("HIDE_HEADER", (state, action) => {
    state.display.showHeader = false
  })

  builder.addCase("SHOW_HEADER", (state, action) => {
    state.display.showHeader = true
  })

  builder.addCase("HIDE_ZOOM_CONTROL", (state, action) => {
    state.display.showZoomControl = false
  })

  builder.addCase("SHOW_ZOOM_CONTROL", (state, action) => {
    state.display.showZoomControl = true
  })

  builder.addMatcher(
    action => MESSAGE_ACTIONS.has(action.type),
    (state, action) => {
      state.display.userMessage = ACTION_TO_MESSAGE[action.type]
    }
  )
}

export default builderCallback
