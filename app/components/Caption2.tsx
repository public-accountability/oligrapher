import React, { useCallback, useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import Draggable from "react-draggable"
import { editModeSelector } from "../util/selectors"
import { MdOpenWith, MdSouthEast } from "react-icons/md"
import { useScale } from "../util/useScale"
import CaptionResizer from "./CaptionResizer"
import ScaleContext from "../util/ScaleContext"

type CaptionProps = {
  caption: Caption
  currentlyEdited: boolean
  status: "normal" | "highlighted" | "faded"
}

const eventHalt = event => {
  event.stopPropagation()
  event.preventDefault()
}

// <g>
//    <foreignObject>
//      <div>
//        <div.caption-text-move>
//        <div.caption-text-resize>
//        <div.caption-text-text>
export default function Caption(props: CaptionProps) {
  const id = props.caption.id
  const scale = useContext(ScaleContext)
  const [width, setWidth] = useState(props.caption.width)
  const [height, setHeight] = useState(props.caption.height)

  const editMode = useSelector(editModeSelector)
  const dispatch = useDispatch()

  const divStyle = {
    fontFamily: props.caption.font,
    fontSize: props.caption.size + "px",
    fontWeight: props.caption.weight,
    width: width + "px",
    height: height + "px",
  }

  const divClassName = `caption-text caption-text-${props.status} ${editMode ? "editing" : ""}`

  const onClick = () => {
    dispatch({ type: "CLICK_CAPTION", id })
  }

  const onStart = () => {
    console.log("onstart")
  }

  const onResize = (event, data) => {
    console.log("scale", scale)
    console.log("on drag", data)
    eventHalt(event)
    const deltaX = data.x - data.lastX
    const deltaY = data.y - data.lastY
    setWidth(width + deltaX)
    setHeight(height + deltaY)
  }

  return (
    <Draggable
      disabled={props.currentlyEdited}
      onStart={eventHalt}
      onStop={eventHalt}
      onDrag={eventHalt}
      scale={scale}
      handle=".caption-text-move"
    >
      <g className="oligrapher-caption" id={`caption-${id}`} onClick={onClick}>
        <foreignObject
          x={props.caption.x - 1}
          y={props.caption.y - 1}
          width={width + 4}
          height={height + 4}
        >
          <div xmlns="http://www.w3.org/1999/xhtml" className={divClassName} style={divStyle}>
            <div className="caption-text-move">
              <MdOpenWith />
            </div>
            <CaptionResizer scale={scale} onStart={onStart} onDrag={onResize} />
            <div className="caption-text-text">{props.caption.text}</div>
          </div>
        </foreignObject>
      </g>
    </Draggable>
  )
}
