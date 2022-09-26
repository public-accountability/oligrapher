import React, { useState } from 'react'
import Draggable, { DraggableEventHandler, DraggableProps } from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import { getElementById } from '../util/helpers'
import { currentZoomSelector } from '../util/selectors'

interface DraggableComponentProps extends DraggableProps {
  nodeId: string,
  onClick?: DraggableEventHandler
}

// Wrapper around Draggable from react-draggable which
//   - adds another callback, onClick, for click events
//   - set the scale = state.display.svgZoom
export function DraggableComponent(props: DraggableComponentProps) {
  const dispatch = useDispatch()

  const zoom = useSelector(currentZoomSelector)

  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0})
  const [scale, setScale] = useState(1)

  const onStart: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()  // see https://github.com/react-grid-layout/react-draggable/issues/11

    // Adjust draggable scale based on <svg>
    // This is a direct way to get the scale from the dom.
    // You can also try passing a Ref or storing this value in the store
    const svg = getElementById('oligrapher-svg')
    setScale(
      (svg.getBoundingClientRect().width / svg.viewBox.baseVal.width) * zoom
    )

    setDragStartPos({ x: evt.screenX, y: evt.screenY })
    dispatch({ type: 'DRAG_NODE_START', id: props.nodeId })
    props.onStart && props.onStart(evt, data)
  }

  const onDrag: DraggableEventHandler = (evt, data) => {
    props.onDrag && props.onDrag(evt, data)
  }

  // see https://github.com/react-grid-layout/react-draggable/issues/531
  const onStop: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()
    const mouseHasBarelyMoved = Math.abs(dragStartPos.x - evt.screenX) < 5 || Math.abs(dragStartPos.y - evt.screenY) < 5

    if (mouseHasBarelyMoved) {
      props.onClick && props.onClick(evt, data)
    } else {
      props.onStop && props.onStop(evt, data)
    }

    dispatch({ type: 'DRAG_NODE_STOP' })
  }

  const draggableProps = Object.assign({ position: { x: 0, y: 0 } }, props, { onDrag, onStop, onStart, scale })

  return <Draggable {...draggableProps} >
           {props.children}
         </Draggable>

}

export default DraggableComponent
