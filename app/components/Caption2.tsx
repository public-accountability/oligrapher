import React, { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import Draggable from "react-draggable"
import { editModeSelector } from "../util/selectors"
import { MdOpenWith, MdSouthEast } from "react-icons/md"

type CaptionProps = {
  caption: Caption
  currentlyEdited: boolean
  status: "normal" | "highlighted" | "faded"
}

const eventHalt = event => {
  event.stopPropagation()
  event.preventDefault()
}

export const styleForCaption = (caption: Caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + "px",
    fontWeight: caption.weight,
    // height: caption.height + "px",
    //width: caption.width + "px",
  }
}

/* const CustomComponent = () => {
 *   const { width, height, ref } = useResizeDetector()
 *   return <div ref={ref}>{`${width}x${height}`}</div>
 *  */

// <g>
//    <foreignObject>
//      <div>
//        <div.caption-text-move>
//        <div.caption-text-resize>
//        <div.caption-text-text>
export default function Caption(props: CaptionProps) {
  const id = props.caption.id

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

  //console.log(`${props.caption.width}/${width} ${props.caption.height}/${height}`)

  const onClick = () => {
    dispatch({ type: "CLICK_CAPTION", id })
  }

  return (
    <Draggable
      disabled={props.currentlyEdited}
      onStart={eventHalt}
      onStop={eventHalt}
      onDrag={eventHalt}
      handle=".caption-text-move"
    >
      <g className="oligrapher-caption" id={`caption-${id}`} onClick={onClick}>
        <foreignObject
          x={props.caption.x}
          y={props.caption.y}
          width={width + 2}
          height={height + 2}
        >
          <div xmlns="http://www.w3.org/1999/xhtml" className={divClassName} style={divStyle}>
            <div className="caption-text-move">
              <MdOpenWith />
            </div>
            <div className="caption-text-resize">
              <MdSouthEast />
            </div>
            <div className="caption-text-text">{props.caption.text}</div>
          </div>
        </foreignObject>
      </g>
    </Draggable>
  )
}
