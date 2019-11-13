import React from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import { xy } from '../../util/helpers'

const DEFAULT_POSITION = {x: 0, y: 0}

export default function DraggableNode(props) {
  const onDrag = (e, d) => {}  // TODO: trigger edge drag
  const onStop = (e, d) => props.onStop(xy(d))
  const draggableProps = { onDrag, onStop, scale: props.actualZoom, position: DEFAULT_POSITION }

  return <Draggable {...draggableProps} >
           {props.children}
         </Draggable>
}

DraggableNode.propTypes = {
  children:   PropTypes.node.isRequired,
  onStop:     PropTypes.func.isRequired,
  actualZoom: PropTypes.number
}

DraggableNode.defaultProps = {
  actualZoom: 1
}
