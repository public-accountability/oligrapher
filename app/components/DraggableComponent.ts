import React, { useState } from 'react'
import Draggable, { DraggableEventHandler, ControlPosition } from 'react-draggable'
import { useSelector } from 'react-redux'
import { StateWithHistory } from '../util/defaultState'

type PositionDataHandler = (data: ControlPosition) => void | false

type DraggableComponentProps = {
  children: React.ReactNode,
  handle: string,
  svgZoom: number,
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
  const [isDragging, setDragging] = useState(false)
  const svgZoom = useSelector<StateWithHistory, number>(state=> state.display.svgZoom)

  const onDrag: DraggableEventHandler = (evt, data) => {
    setDragging(true)
    const { x, y } = data
    props.onDrag && props.onDrag({ x, y })
  }

  const onStop: DraggableEventHandler = (evt, data) => {
    if (isDragging) {
      setDragging(false)
      props.onStop && props.onStop({ x: data.x, y: data.y })
    } else if (props.onClick) {
      props.onClick(evt, data)
    }
  }

  const draggableProps = {
    onDrag,
    onStop,
    onStart: props.onStart,
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
