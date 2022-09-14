import React, { useState } from 'react'
import Draggable, { DraggableEventHandler, ControlPosition, DraggableEvent } from 'react-draggable'
import { useSelector } from 'react-redux'
import { StateWithHistory } from '../util/defaultState'

type PositionDataHandler = (data: ControlPosition) => void | false

type DraggableComponentProps = {
  children: React.ReactNode,
  handle: string,
  position?: ControlPosition,
  onStop: PositionDataHandler,
  onDrag?: PositionDataHandler,
  onStart?: DraggableEventHandler,
  onClick?: DraggableEventHandler,
  disabled?: boolean,
  enableUserSelectHack?: boolean
}

const ZEROZERO = { x: 0, y: 0 }

// Wrapper around Draggable that can also handle click events
export default function DraggableComponent(props: DraggableComponentProps) {
  const [dragStartPos, setDragStartPos] = useState(ZEROZERO)
  const svgZoom = useSelector<StateWithHistory, number>(state=> state.display.svgZoom)

  const onStart: DraggableEventHandler = (evt, data) => {
    setDragStartPos({ x: evt.screenX, y: evt.screenY })
    props.onStart && props.onStart(evt, data)
  }

  const onDrag: DraggableEventHandler = (evt, data) => {
    props.onDrag && props.onDrag({ x: data.x, y: data.y })
  }

  // see https://github.com/react-grid-layout/react-draggable/issues/531
  const onStop: DraggableEventHandler = (evt, data) => {
    // calls onClick instead of onStop if mouse has not moved (or barely moved)
    if (Math.abs(dragStartPos.x - evt.screenX) < 5 || Math.abs(dragStartPos.y - evt.screenY) < 5 ) {
      props.onClick && props.onClick(evt, data)
    } else {
      props.onStop && props.onStop({ x: data.x, y: data.y })
    }
  }

  const draggableProps = {
    onDrag, onStop, onStart,
    scale: svgZoom,
    handle: props.handle,
    disabled: Boolean(props.disabled),
    // Setting the position to 0,0 has the effect of ensuring that all drag deltas always start with 0,0.
    // The onStop and onDrag callbacks all work off of relative coordinates.
    position: props.position || ZEROZERO
    // enableUserSelectHack: props.enableUserSelectHack
  }

  return React.createElement(Draggable, draggableProps, props.children)
}
