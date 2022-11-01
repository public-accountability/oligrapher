import React from "react"
import { useDispatch } from "react-redux"
import { Caption } from "../graph/caption"
import Draggable from "react-draggable"

type CaptionProps = {
  caption: Caption
  currentlyEdited: boolean
  status: "normal" | "highlighted" | "faded"
}

export const styleForCaption = (caption: Caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + "px",
    fontWeight: caption.weight,
    height: caption.height + "px",
    width: caption.width + "px",
  }
}

export default function Caption(props: CaptionProps) {
  const dispatch = useDispatch()
  const id = props.caption.id

  const onClick = () => {
    dispatch({ type: "CLICK_CAPTION", id })
  }

  const onStart = (event, data) => {
    event.stopPropagation()
    event.preventDefault()
  }
  const onStop = (event, data) => {
    event.stopPropagation()
    event.preventDefault()
  }
  const onDrag = (event, data) => {
    event.stopPropagation()
    event.preventDefault()
  }

  return (
    <Draggable disabled={props.currentlyEdited} onStart={onStart} onStop={onStop} onDrag={onDrag}>
      <g className="oligrapher-caption" id={`caption-${id}`} onClick={onClick}>
        <foreignObject
          x={props.caption.x}
          y={props.caption.y}
          width={props.caption.width}
          height={props.caption.height}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className={`caption-text caption-text-${props.status}`}
            style={styleForCaption(props.caption)}
          >
            {props.caption.text}
          </div>
        </foreignObject>
      </g>
    </Draggable>
  )
}