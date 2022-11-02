import React, { useContext, useState } from "react"
import Draggable, { DraggableEventHandler, DraggableProps } from "react-draggable"
import { useSelector } from "react-redux"
import { svgScaleSelector } from "../util/selectors"

interface DraggableComponentProps extends DraggableProps {
  onClick?: DraggableEventHandler
}

// Wrapper around Draggable from react-draggable which
//   - adds another callback, onClick, for click events
export function DraggableComponent(props: DraggableComponentProps) {
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const scale = useSelector(svgScaleSelector)

  const onStart: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation() // see https://github.com/react-grid-layout/react-draggable/issues/11
    setDragStartPos({ x: evt.screenX, y: evt.screenY })
    props.onStart && props.onStart(evt, data)
  }

  const onDrag: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()
    props.onDrag && props.onDrag(evt, data)
  }

  // see https://github.com/react-grid-layout/react-draggable/issues/531
  const onStop: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()
    const mouseHasBarelyMoved =
      Math.abs(dragStartPos.x - evt.screenX) < 5 || Math.abs(dragStartPos.y - evt.screenY) < 5

    if (mouseHasBarelyMoved) {
      props.onClick && props.onClick(evt, data)
    } else {
      props.onStop && props.onStop(evt, data)
    }
  }

  const draggableProps = Object.assign({ position: { x: 0, y: 0 } }, props, {
    onDrag,
    onStop,
    onStart,
    scale,
  })

  return <Draggable {...draggableProps}>{props.children}</Draggable>
}

export default DraggableComponent
