import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { xy } from '../../util/helpers'

const DEFAULT_POSITION = { x: 0, y: 0 }

export default function DraggableNode(props) {
  const onDrag = (e, d) => props.onDrag(xy(d))
  const onStop = (e, d) => props.onStop(xy(d))

  // The setting the position to 0,0 has the effect of ensuring that
  // all drag deltas always start with 0,0.
  // The onStop and onDrag callbacks all work off of relative coordinates.
  const draggableProps = { onDrag, onStop, scale: props.actualZoom, position: DEFAULT_POSITION }

  return <Draggable {...draggableProps} >
           {props.children}
         </Draggable>
}

DraggableNode.propTypes = {
  children:   PropTypes.node.isRequired,
  onStop:     PropTypes.func.isRequired,
  onDrag:     PropTypes.func.isRequired,
  actualZoom: PropTypes.number
}

// Because actualZoom is derived from
DraggableNode.defaultProps = {
  actualZoom: 1
}
