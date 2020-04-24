import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'
import noop from 'lodash/noop'
import { xy } from '../../util/helpers'

const DEFAULT_POSITION = { x: 0, y: 0 }

/*
  Wrapper around react-draggable
  Required props: onDrag, onStop, handle
*/
export default function DraggableComponent(props) {
  const [isDragging, setDragging] = useState(false)

  const onDrag = (evt, data) => {
    setDragging(true)
    props.onDrag(xy(data))
  }

  const onStop = (evt, data) => {
    if (isDragging) {
      props.onStop(xy(data))
      setDragging(false)
    } else {
      props.onClick(evt, data)
    }
  }

  // The setting the position to 0,0 has the effect of ensuring that
  // all drag deltas always start with 0,0.
  // The onStop and onDrag callbacks all work off of relative coordinates.
  const draggableProps = { 
    onDrag,
    onStop,
    scale: props.actualZoom,
    position: DEFAULT_POSITION,
    handle: props.handle,
    disabled: props.disabled
  }

  return (
    <Draggable {...draggableProps}>
      {props.children}
    </Draggable>
  )
}

DraggableComponent.propTypes = {
  children: PropTypes.node.isRequired,
  onStop: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  handle: PropTypes.string.isRequired,
  actualZoom: PropTypes.number,
  disabled: PropTypes.bool
}

DraggableComponent.defaultProps = {
  actualZoom: 1,
  onClick: noop
}
