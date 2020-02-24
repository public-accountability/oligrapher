import produce from 'immer'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import toNumber from 'lodash/toNumber'

import { translatePoint } from './util/helpers'

import Graph from './graph/graph'
import Edge from './graph/edge'
import Caption from './graph/caption'

import FloatingMenu from './util/floatingMenu'

const ZOOM_INTERVAL = 0.2

const checkOpenTool = (current, required) => {
  if (isEqual(current, required)) { return true }
  console.error('Correct tool is not open.')
  return false
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
  ADD_CONNECTION         | entity, relationship
  UPDATE_SETTING         | key, value
*/

export default produce( (draft, action) => {
  switch(action.type) {
  case 'SET_ACTUAL_ZOOM':
    draft.graph.actualZoom = action.actualZoom
    return
  case 'ADD_NODE':
    Graph.addNode(draft.graph, action.attributes)
    return
  case 'ADD_NODES':
    Graph.addNodes(draft.graph, action.nodes)
    return
  case 'UPDATE_NODE':
    Graph.updateNode(draft.graph, action.id, action.attributes)
    return
  case 'REMOVE_NODE':
    Graph.removeNode(draft.graph, action.id)
    FloatingMenu.clear(draft)
    return
  case 'MOVE_NODE':
    if (action.editorTool === 'node') {
      Graph.dragNode(draft.graph, action.id, action.deltas)
      Graph.moveNode(draft.graph, action.id, action.deltas)
    }

    // The is the drag to create edges feature:
    if (action.editorTool === 'edge') {
      let node1 = Graph.getNode(draft.graph, action.id)
      let node2 = Graph.intersectingNodeFromDrag(draft.graph, action.id, action.deltas)

      if (node2) {
        Graph.addEdge(draft.graph, Edge.newEdgeFromNodes(node1, node2))
      }
    }
    return
  case 'DRAG_NODE':
    if (action.editorTool === 'node') {
      Graph.dragNode(draft.graph, action.id, action.deltas)
    }

    if (action.editorTool === 'edge') {
      // Display message about which node will be connected ?
    }

    return
  case 'UPDATE_EDGE':
    Graph.updateEdge(draft.graph, action.id, action.attributes)
    return
  // Reserving "DELETE" for future ability to delete data from littlesis backend
  case 'REMOVE_EDGE':
    Graph.removeEdge(draft.graph, action.id)
    FloatingMenu.clear(draft)
    return
  case 'NEW_CAPTION':
    Graph.addCaption(draft.graph, Caption.fromEvent(action.event, draft.zoom))
    return
  case 'UPDATE_CAPTION':
    merge(draft.graph.captions[action.id], action.attributes)
    return
  case 'MOVE_CAPTION':
    merge(draft.graph.captions[action.id], translatePoint(draft.graph.captions[action.id], action.deltas))
    return
  case 'DELETE_CAPTION':
    // caption can be deleted directly or through floating menu
    let id = action.id || FloatingMenu.getId(draft, 'caption')

    if (id) {
      delete draft.graph.captions[action.id]
      FloatingMenu.clear(draft)
    }

    return
  case 'ZOOM':
    if (action.direction === 'IN') {
      draft.graph.zoom = draft.graph.zoom + ZOOM_INTERVAL
    } else if (action.direction === 'OUT') {
      draft.graph.zoom = draft.graph.zoom - ZOOM_INTERVAL
    }
    return
  case 'SET_MODE':
    draft.display.modes[action.mode] = action.enabled
    return
  case 'OPEN_TOOL':
    // if (draft.display.editor.tool === 'node') {
    //   FloatingMenu.clear() // Reset the selected node
    // }

    draft.display.editor.tool = action.item

    if (draft.display.editor.tool === 'settings') {
      FloatingMenu.set(draft, 'settings')
    } else {
      FloatingMenu.clear(draft)
    }

    return
  case 'OPEN_EDIT_NODE_MENU':
    FloatingMenu.set(draft, 'node', action.id)
    return
  case 'OPEN_ADD_CONNECTIONS_MENU':
    if (Number.isFinite(toNumber(action.id))) {
      FloatingMenu.set(draft, 'connections', action.id)
    } else {
      console.error(`Cannot find connections unless the entity is a LittlesSis Entity. id == ${action.id}`)
    }
    return
  case 'OPEN_EDIT_EDGE_MENU':
    FloatingMenu.set(draft, 'edge', action.id)
    return
  case 'OPEN_EDIT_CAPTION_MENU':
    FloatingMenu.set(draft, 'caption', action.id)
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
  case 'BACKGROUND_CLICK':

    // Add new caption
    if (checkOpenTool(draft.display.editor.tool, 'text')) {
      const caption = Caption.fromEvent(action.event, draft.graph.zoom)

      Graph.addCaption(draft.graph, caption)
      FloatingMenu.set(draft, 'caption')
    }

    return
  case 'ADD_CONNECTION':
    // action.entity -- littlesis api entity object
    // action.relationship -- littlesis api relationship object
    // action.node -- current node

    Graph.addConnection(draft.graph, {
      entity: action.entity,
      relationship: action.relationship,
      node: action.node
    })

    return

  case 'UPDATE_SETTING':
    updateSettings(draft.attributes.settings, action.key, action.value)
    return
  default:
    return
  }
}, null)


// export default combineReducers({
//   graph,
//   display,
//   selection,
//   settings,
//   hooks,
//   attributes
// })
