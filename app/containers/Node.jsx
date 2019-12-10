import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'

import DraggableNode from './../components/graph/DraggableNode'
import NodeCircle from './../components/graph/NodeCircle'
import NodeLabel from './../components/graph/NodeLabel'

const DEFAULT_COLOR = "#ccc"
const CIRCLE_PROPS = ['x', 'y', 'scale', 'color']
const LABEL_PROPS = ['x', 'y', 'name', 'scale', 'status', 'url']

export function Node(props) {
  return <DraggableNode onStop={props.onStop} onDrag={props.onDrag} actualZoom={props.actualZoom} >
           <g id={"node-" + props.id} className="oligrapher-node">
             <NodeCircle {...pick(props, CIRCLE_PROPS)} />
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
  const actualZoom = state.graph.actualZoom

  return { ...node, id, actualZoom }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const id = ownProps.id.toString()

  return {
    onStop: (deltas) => dispatch({ type: 'MOVE_NODE', id: id, deltas: deltas }),
    onDrag: (deltas) => dispatch({ type: 'DRAG_NODE', id: id, deltas: deltas })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Node)
