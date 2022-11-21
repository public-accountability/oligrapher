import React, { useState } from "react"
import { classNames } from "../util/helpers"
import { useDispatch, useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import { DraggableEventHandler } from "react-draggable"
import { editModeSelector, storyModeSelector, svgScaleSelector } from "../util/selectors"

import DraggableComponent from "./DraggableComponent"

type CaptionProps = {
  caption: Caption
  status: "normal" | "highlighted" | "faded"
}

const TSpan: React.FC<React.SVGProps<SVGTSpanElement> & { text: string }> = ({ x, text }) => {
  return (
    <tspan x={x} dy="1em">
      {text}
    </tspan>
  )
}

export default function Caption(props: CaptionProps) {
  const id = props.caption.id
  const dispatch = useDispatch()
  const scale = useSelector(svgScaleSelector)
  const storyMode = useSelector(storyModeSelector)
  const editMode = useSelector(editModeSelector)
  // hide editing controls when in presentation mode or annotation editor is open
  const isEditing = editMode && !storyMode

  const [isDragging, setDragging] = useState(false)

  const onMouseEnter = () => {
    dispatch({ type: "MOUSE_ENTERED_CAPTION", id })
  }
  const onMouseLeave = () => {
    dispatch({ type: "MOUSE_LEFT_CAPTION", id })
  }

  const onDrag: DraggableEventHandler = () => {
    setDragging(true)
  }

  const onClick: DraggableEventHandler = event => {
    event.preventDefault()
    setDragging(false)
    dispatch({ type: "CLICK_CAPTION", id })
  }

  const afterMove: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: "MOVE_CAPTION", id, deltas })
    setDragging(false)
  }

  const gClassName = classNames(
    "oligrapher-caption",
    `oligrapher-caption-${props.status}`,
    isEditing ? "editing" : undefined,
    isDragging ? "dragging" : undefined
  )

  const textAttributes = {
    x: props.caption.x,
    y: props.caption.y,
    fontSize: props.caption.size,
    fontFamily: props.caption.font,
    fontWeight: props.caption.weight,
  }

  return (
    <DraggableComponent
      disabled={!isEditing}
      scale={scale}
      onStop={afterMove}
      onClick={onClick}
      onDrag={onDrag}
    >
      <g
        className={gClassName}
        id={`caption-${id}`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={e => e.stopPropagation()}
      >
        <text {...textAttributes}>
          {props.caption.text.split("\n").map((t, i) => (
            <TSpan key={i} x={props.caption.x} text={t} />
          ))}
        </text>
      </g>
    </DraggableComponent>
  )
}
