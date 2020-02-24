import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import curry from 'lodash/curry'
import noop from 'lodash/noop'
import pick from 'lodash/pick'
import { frozenArray, callWithPersistedEvent } from '../util/helpers'

import NodeHandles from './NodeHandles'
import DraggableComponent from './../components/graph/DraggableComponent'
import NodeHalo from './../components/graph/NodeHalo'
import NodeCircle from './../components/graph/NodeCircle'
import NodeImage from './../components/graph/NodeImage'
import NodeLabel from './../components/graph/NodeLabel'

const DEFAULT_RADIUS = 25
const DEFAULT_COLOR = "#ccc"

const HALO_PROPS = frozenArray('x', 'y', 'radius')
const CIRCLE_PROPS = frozenArray('x', 'y', 'radius', 'color')
const IMAGE_PROPS = frozenArray('id', 'x', 'y', 'radius', 'image')
const LABEL_PROPS = frozenArray('x', 'y', 'name', 'radius', 'status', 'url')
const DRAGGABLE_PROPS = frozenArray('onStop', 'onDrag', 'onClick', 'actualZoom')
const HANDLES_PROPS = frozenArray('id', 'x', 'y', 'radius')

export function Node(props) {
  const showImage = Boolean(props.image)
  const showCircle = !showImage
  const showHalo = props.selected
  const showNodeHandles = props.editorMode && props.nodeToolOpen

  return  <g id={"node-" + props.id} className="oligrapher-node">
            <DraggableComponent {...pick(props, DRAGGABLE_PROPS)} handle=".draggable-node-handle">
              <g>
                { showHalo && <NodeHalo {...pick(props, HALO_PROPS)} /> }
                { showCircle && <NodeCircle {...pick(props, CIRCLE_PROPS)} /> }
                { showImage && <NodeImage {...pick(props, IMAGE_PROPS)} /> }
                <NodeLabel {...pick(props, LABEL_PROPS)} />
                { showNodeHandles && <NodeHandles {...pick(props, HANDLES_PROPS) }/>}
              </g>
            </DraggableComponent>
          </g>
}

Node.propTypes = {
  // Node attributes
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string.isRequired,
  // scale: PropTypes.number.isRequired,
  // Virtual attributes
  radius: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,

  // Actions
  onStop: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  openEditNodeMenu: PropTypes.func.isRequired,

  // UI helpers
  actualZoom: PropTypes.number,
  editorMode: PropTypes.bool.isRequired,
  nodeToolOpen: PropTypes.bool.isRequired,
  edgeToolOpen: PropTypes.bool.isRequired
}

Node.defaultProps = {
  color: DEFAULT_COLOR,
  openEditNodeMenu: noop,
  onClick: noop
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const node = state.graph.nodes[id]

  return {
    ...node,
    radius: DEFAULT_RADIUS * node.scale,
    id: id,
    zoom: state.graph.zoom,
    actualZoom: state.graph.actualZoom,
    editorMode: state.display.modes.editor,
    editorTool: state.display.editor.tool,
    nodeToolOpen: state.display.editor.tool === 'node',
    edgeToolOpen: state.display.editor.tool === 'edge',
    selected: state.display.selectedNodes.has(id)
  }
}

/*
  There are two types of actions here: MOVE_NODE and DRAG_NODE,
  which correspond to react-draggable's onStop and onDrag.

  Dragging cause different actions depending on which editorTool is open

  editorTool: "node"   moves nodes around
  editorTool: "edge"   creates new edges on between connected nodes

*/
function nodeMovementFunc(dispatch, id, actionType, editorTool, deltas) {
  return ['node', 'edge'].includes(editorTool)
    ? dispatch({ type: actionType,
                 editorTool: editorTool,
                 deltas: deltas,
                 id: id })
    : noop
}


const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    nodeMovement: curry(nodeMovementFunc)(dispatch, id),
    onClick: callWithPersistedEvent( event => dispatch({ id, event, type: 'NODE_CLICK' }))
  }
}

const mergeProps = (stateProps, dispatchProps) => {
  let editorTool = stateProps.editorTool

  return { ...stateProps,
           ...dispatchProps,
           onStop: dispatchProps.nodeMovement('MOVE_NODE', editorTool),
           onDrag: dispatchProps.nodeMovement('DRAG_NODE', editorTool)
         }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Node)
