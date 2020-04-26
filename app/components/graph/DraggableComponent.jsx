import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Draggable from 'react-draggable'
import noop from 'lodash/noop'

/*
  Wrapper around react-draggable
  Required props: onDrag, onStop, handle
*/
export default function DraggableComponent(props) {
  const [isDragging, setDragging] = useState(false)
  const svgZoom = useSelector(state => state.display.svgZoom)

  const onDrag = (evt, data) => {
    setDragging(true)
    const { x, y } = data
    props.onDrag({ x, y })
  }

  const onStop = (evt, data) => {
    if (isDragging) {
      const { x, y } = data
      props.onStop({ x, y })
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
    scale: svgZoom,
    position: props.position,
    handle: props.handle,
    disabled: props.disabled,
    enableUserSelectHack: props.enableUserSelectHack
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
  onDrag: PropTypes.func,
  onClick: PropTypes.func,
  handle: PropTypes.string.isRequired,
  position: PropTypes.object,
  disabled: PropTypes.bool,
  enableUserSelectHack: PropTypes.bool
}

DraggableComponent.defaultProps = {
  position: { x: 0, y: 0 },
  onDrag: noop,
  onClick: noop
}
