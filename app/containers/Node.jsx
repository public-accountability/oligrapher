import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import subtract from 'lodash/subtract'
import add from 'lodash/add'

import DraggableNode from './../components/graph/DraggableNode'
import NodeCircle from './../components/graph/NodeCircle'
import NodeLabel from './../components/graph/NodeLabel'
import NodeHandle from './../components/graph/NodeHandle'

import ds from '../NodeDisplaySettings'

const DEFAULT_COLOR = "#ccc"
const CIRCLE_PROPS = ['x', 'y', 'scale', 'color']
const LABEL_PROPS = ['x', 'y', 'name', 'scale', 'status', 'url']


function nodeHandleAction(side) {
  return () => console.log(`you clicked the ${side} node handle`)
}

// left | right, {number, number, number} --> {x, y}
// This calculate the center of the editor handle
function nodeHandleCoords(side, {x, y, scale}) {
  const operation = side === 'right' ? add : subtract

  return {
    x: operation(x, (ds.circleRadius * scale)),
    y: y
  }
}

function nodeHandles(props) {
  if (!props.editorMode) { return <></> }

  return [
    <NodeHandle {...nodeHandleCoords('left', props)} action={nodeHandleAction('left')} key="left" />,
    <NodeHandle {...nodeHandleCoords('right', props)} action={nodeHandleAction('right')} key="right" />
  ]
}

export function Node(props) {
  return <DraggableNode onStop={props.onStop} onDrag={props.onDrag} actualZoom={props.actualZoom} >
           <g id={"node-" + props.id} className="oligrapher-node">
             <NodeCircle {...pick(props, CIRCLE_PROPS)} />
             { nodeHandles(props) }
             <NodeLabel {...pick(props, LABEL_PROPS)} />
           </g>
         </DraggableNode>
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string.isRequired,
  onStop: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  actualZoom: PropTypes.number
}

Node.defaultProps = {
  color: DEFAULT_COLOR
}


const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const node = state.graph.nodes[id]

  return {
    ...node,
    id: id,
    actualZoom: state.graph.actualZoom,
    editorMode: state.display.modes.editor
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    onStop: (deltas) => dispatch({ type: 'MOVE_NODE', id: id, deltas: deltas }),
    onDrag: (deltas) => dispatch({ type: 'DRAG_NODE', id: id, deltas: deltas })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Node)
