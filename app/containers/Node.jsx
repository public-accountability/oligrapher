import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import add from 'lodash/add'
import curry from 'lodash/curry'
import noop from 'lodash/noop'
import pick from 'lodash/pick'
import subtract from 'lodash/subtract'

import DraggableComponent from './../components/graph/DraggableComponent'
import NodeCircle from './../components/graph/NodeCircle'
import NodeImage from './../components/graph/NodeImage'
import NodeLabel from './../components/graph/NodeLabel'
import NodeHandle from './../components/graph/NodeHandle'

//import ds from '../NodeDisplaySettings'

const DEFAULT_RADIUS = 25
const DEFAULT_COLOR = "#ccc"
const CIRCLE_PROPS = ['x', 'y', 'radius', 'color']
const IMAGE_PROPS = ['id', 'x', 'y', 'radius', 'image']
const LABEL_PROPS = ['x', 'y', 'name', 'radius', 'status', 'url']
const DRAGGABLE_PROPS = ['onStop', 'onDrag', 'actualZoom']

function nodeHandleAction(side) {
  return () => console.log(`you clicked the ${side} node handle`)
}

// left | right, {number, number, number} --> {x, y}
// This calculate the center of the editor handle
function nodeHandleCoords(side, {x, y, radius}) {
  const operation = side === 'right' ? add : subtract

  return {
    x: operation(x, radius),
    y: y
  }
}

function nodeHandles(props) {
  if (props.editorMode && props.nodeToolOpen)  {
    return [
      <NodeHandle {...nodeHandleCoords('left', props)} action={nodeHandleAction('left')} key="left" />,
      <NodeHandle {...nodeHandleCoords('right', props)} action={props.openEditNodeMenu} key="right" />
    ]
  }

  return null
}

export function Node(props) {
  const showImage = Boolean(props.image)
  const showCircle = !showImage

  return  <g id={"node-" + props.id} className="oligrapher-node">
            <DraggableComponent {...pick(props, DRAGGABLE_PROPS)} handle=".node-circle">
              <g>
                { showCircle && <NodeCircle {...pick(props, CIRCLE_PROPS)} /> }
                { showImage && <NodeImage {...pick(props, IMAGE_PROPS)} /> }
                <NodeLabel {...pick(props, LABEL_PROPS)} />
                { nodeHandles(props) }
              </g>
            </DraggableComponent>
          </g>
}

Node.propTypes = {
  // Node attributes
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  // radius is calculated in mapStateToProps
  // scale: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string.isRequired,

  // Actions
  onStop: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  openEditNodeMenu: PropTypes.func.isRequired,

  // UI helpers
  actualZoom: PropTypes.number,
  editorMode: PropTypes.bool.isRequired,
  nodeToolOpen: PropTypes.bool.isRequired,
  edgeToolOpen: PropTypes.bool.isRequired
}

Node.defaultProps = {
  color: DEFAULT_COLOR,
  openEditNodeMenu: noop
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
    edgeToolOpen: state.display.editor.tool === 'edge'
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
    openEditNodeMenu: () => dispatch({ type: 'OPEN_EDIT_NODE_MENU', id: id })
  }
}

const mergeProps = (stateProps, dispatchProps) => {
  let editorTool = stateProps.editorTool

  return { ...stateProps,
           ...dispatchProps,
           onStop: dispatchProps.nodeMovement('MOVE_NODE', editorTool),
           onDrag: dispatchProps.nodeMovement('DRAG_NODE', editorTool) }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Node)
