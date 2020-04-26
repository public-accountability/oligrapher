import produce from 'immer'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'

import { translatePoint } from './util/helpers'

import Graph from './graph/graph'
import Edge from './graph/edge'
import Caption from './graph/caption'

import FloatingMenu, { toggleEditor } from './util/floatingMenu'
import EdgeCreation from './util/edgeCreation'
import { isLittleSisId } from './util/helpers'

const ZOOM_INTERVAL = 0.2

// Will eventually use this when implementing selection
//
// const toggleSelectedNode = (draft, id) => {
//   if (draft.display.selectedNodes.has(id)) {
//     draft.display.selectedNodes.delete(id)
//   } else {
//     draft.display.selectedNodes.add(id)
//   }
// }

const convertCaptionSize = (draft, attributes) => {
  if (!attributes.width || !attributes.height) {
    return attributes
  }

  const { svgZoom } = draft.display
  const { width, height } = attributes

  const captionWidth = width / svgZoom
  const captionHeight = height / svgZoom

  return {...attributes, width: captionWidth, height: captionHeight }
}

const updateSettings = (settings, key, value) => {
  settings[key] = value

  if (key === 'defaultStoryMode' && value) {
    settings['defaultExploreMode'] = false
  }

  if (key === 'defaultExploreMode' && value) {
    settings['defaultStoryMode'] = false
  }

  if (key === 'storyModeOnly' && value) {
    settings['exploreModeOnly'] = false
  }

  if (key === 'exploreModeOnly' && value) {
    settings['storyModeOnly'] = false
  }
}

/*
  action.type            |  fields
-------------------------|-------------
  SET_ACTUAL_ZOOM        | actualZoom
  ZOOM                   | direction
  ADD_NODE               | attributes
  ADD_NODES              | nodes
  UPDATE_NODE            | id, attributes
  UPDATE_NODES           | attributes
  MOVE_NODE              | id, deltas
  DRAG_NODE              | id, deltas
  UPDATE_EDGE            | id, attributes
  DELETE_EDGE            | id
  NEW_CAPTION            | event
  UPDATE_CAPTION         | id, attributes
  MOVE_CAPTION           | id, deltas
  DELETE_CAPTION         | [id]
  SET_MODE               | mode, enabled
  OPEN_TOOL              | item
  OPEN_EDIT_NODE_MENU    | id
  OPEN_EDIT_EDGE_MENU    | id
  OPEN_EDIT_CAPTION_MENU | id
  UPDATE_ATTRIBUTE       | name, value
  BACKGROUND_CLICK       | event
  NODE_CLICK             | id, event
  ADD_CONNECTION         | entity, relationship
  UPDATE_SETTING         | key, value
  SAVE_MAP_IN_PROGRESS   |
  SAVE_MAP_SUCCESS       |
  SAVE_MAP_FAILED        |
  SAVE_MAP_RESET         |
  SET_EDITORS            | editors
  SET_LOCK               | lock
*/

let id, intersectedNode, caption

export default produce((draft, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    draft.display.actualZoom = action.actualZoom
    return
  case 'SET_SVG_ZOOM':
    draft.display.svgZoom = action.svgZoom
    return
  case 'SET_OFFSET':
    draft.display.offset = action.offset
    return
  case 'SET_SVG_SIZE':
    draft.display.svgSize = action.size
    return
  case 'SET_HEADER_HEIGHT':
    draft.display.headerHeight = action.height
    return
  case 'ADD_NODE':
    Graph.addNode(draft.graph, action.node, (node) => {
      // only show edit box if node is new
      if (!action.node.id) {
        toggleEditor(draft, node.id, 'node')
      }
    })
    return
  case 'ADD_NODES':
    Graph.addNodes(draft.graph, action.nodes)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(draft.graph, action.id, action.attributes)
    return
  case 'UPDATE_NODES':
    // Updates all the nodes in display.selectedNodes
    for (let nodeId of draft.display.selectedNodes) {
      Graph.updateNode(draft.graph, nodeId, action.attributes)
    }
    return
  case 'REMOVE_NODE':
    Graph.removeNode(draft.graph, action.id)
    FloatingMenu.clear(draft)
    return
  case 'CLICK_NODE':
    toggleEditor(draft, action.id, 'node')
    return  
  case 'MOVE_NODE':
    intersectedNode = Graph.intersectingNodeFromDrag(draft.graph, action.id, action.deltas)

    if (intersectedNode) {
      let intersectingNode = Graph.getNode(draft.graph, action.id)
      let newEdge = Edge.newEdgeFromNodes(intersectingNode, intersectedNode)
      Graph.addEdge(draft.graph, newEdge)
      Graph.dragNode(draft.graph, action.id, { x: 0, y: 0 })
      toggleEditor(draft, newEdge.id, 'edge')
    } else {
      Graph.moveNode(draft.graph, action.id, action.deltas)
      Graph.dragNode(draft.graph, action.id, { x: 0, y: 0 }) // updates node's edges
    }
    
    EdgeCreation.clearNodes(draft)
    return
  case 'DRAG_NODE':
    FloatingMenu.clear(draft)
    Graph.dragNode(draft.graph, action.id, action.deltas)
    intersectedNode = Graph.intersectingNodeFromDrag(draft.graph, action.id, action.deltas)

    if (intersectedNode) {
      EdgeCreation.setNodes(draft, [action.id, intersectedNode.id])
    } else {
      EdgeCreation.clearNodes(draft)
    }

    return
  case 'ADD_EDGE':
    Graph.addEdgeIfNodes(draft.graph, action.edge)
    return
  case 'ADD_EDGES':
    action.edges.forEach(edge => Graph.addEdgeIfNodes(draft.graph, edge))
    return
  case 'UPDATE_EDGE':
    Graph.updateEdge(draft.graph, action.id, action.attributes)
    return
  // Reserving "DELETE" for future ability to delete data from littlesis backend
  case 'REMOVE_EDGE':
    Graph.removeEdge(draft.graph, action.id)
    FloatingMenu.clear(draft)
    return
  case 'CLICK_EDGE':
    toggleEditor(draft, action.id, 'edge')
    return
  case 'ADD_CAPTION':
    caption = Caption.fromEvent(action.event, draft.display.zoom)
    Graph.addCaption(draft.graph, caption)
    toggleEditor(draft, caption.id, 'caption')
    return
  case 'UPDATE_CAPTION':
    merge(draft.graph.captions[action.id], convertCaptionSize(draft, action.attributes))
    return
  case 'MOVE_CAPTION':
    merge(draft.graph.captions[action.id], translatePoint(draft.graph.captions[action.id], action.deltas))
    return
  case 'DELETE_CAPTION':
    // caption can be deleted directly or through floating menu
    id = action.id || FloatingMenu.getId(draft, 'caption')

    if (id) {
      delete draft.graph.captions[action.id]
      FloatingMenu.clear(draft)
    }

    return
  case 'CLICK_CAPTION':
    toggleEditor(draft, action.id, 'caption')
    return
  case 'ZOOM_IN':
    draft.display.zoom = draft.display.zoom + ZOOM_INTERVAL
    return
  case 'ZOOM_OUT':
    draft.display.zoom = draft.display.zoom - ZOOM_INTERVAL
    return
  case 'SET_MODE':
    draft.display.modes[action.mode] = action.enabled
    return
  case 'TOGGLE_TOOL':
    draft.display.editor.tool = (draft.display.editor.tool === action.tool) ? null : action.tool

    // Tools with floating menus that are always open
    if (['settings', 'style', 'editors'].includes(draft.display.editor.tool)) {
      FloatingMenu.set(draft, draft.display.editor.tool)
    } else {
      FloatingMenu.clear(draft)
    }

    return
  case 'OPEN_ADD_CONNECTIONS_MENU':
    if (isLittleSisId(action.id)) {
      // no need to transform position as this is only opened from EditNode,
      // which is already positioned
      FloatingMenu.set(draft, 'connections', action.id, action.position)
    } else {
      console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
    }
    return
  case 'CLOSE_EDIT_MENU':
    FloatingMenu.set(draft)
    return
  case 'UPDATE_ATTRIBUTE':
    if (!['title', 'subtitle'].includes(action.name)) {
      throw new Error(`Unknown attribute: ${action.name}`)
    }

    draft.attributes[action.name] = action.value
    return
  case 'ADD_CONNECTION':
    Graph.addConnection(draft.graph, {
      newNode: action.newNode,
      newEdge: action.newEdge,
      existingNodeId: action.existingNodeId
    })
    return
  case 'UPDATE_SETTING':
    updateSettings(draft.attributes.settings, action.key, action.value)
    return

  // Save map actions
  case 'SAVE_MAP_IN_PROGRESS':
    draft.display.saveMap = 'IN_PROGRESS'
    return
  case 'SAVE_MAP_SUCCESS':
    draft.display.saveMap = 'SUCCESS'
    return
  case 'SAVE_MAP_FAILED':
    draft.display.saveMap = 'FAILED'
    return
  case 'SAVE_MAP_RESET':
    draft.display.saveMap = null
    return

  case 'SET_EDITORS':
    draft.attributes.editors = action.editors
    return
  case 'SET_LOCK':
    draft.attributes.lock = action.lock
    return
  default:
    return
  }
}, null)
