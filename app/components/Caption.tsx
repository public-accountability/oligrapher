import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import { DraggableEventHandler } from "react-draggable"
import { editModeSelector, storyModeSelector, svgScaleSelector } from "../util/selectors"

import CaptionResizer from "./CaptionResizer"
import DraggableComponent from "./DraggableComponent"
import { eventHalt } from "../util/helpers"
import CaptionTextbox from "./CaptionTextbox"
import CaptionTextboxEditorMenu from "./CaptionTextboxEditorMenu"

type CaptionProps = {
  caption: Caption
  currentlyEdited: boolean
  status: "normal" | "highlighted" | "faded"
}

// <g>
//    <foreignObject>
//      <div>
//        <div.caption-text-move>
//        <div.caption-text-resize>
//        <div.caption-text-text>
export default function Caption(props: CaptionProps) {
  const id = props.caption.id
  const scale = useSelector(svgScaleSelector)
  const dispatch = useDispatch()
  const [width, setWidth] = useState(props.caption.width)
  const [height, setHeight] = useState(props.caption.height)
  const storyMode = useSelector(storyModeSelector)
  const editMode = useSelector(editModeSelector)

  const textboxRef = React.createRef<HTMLDivElement>()

  // hide editing controls when in presentation mode or annotation editor is open
  const isEditing = editMode && !storyMode

  const divStyle = {
    fontFamily: props.caption.font,
    fontSize: props.caption.size + "px",
    fontWeight: props.caption.weight,
    width: width + "px",
    height: height + "px",
  }

  const divClassName = `caption-text caption-text-${props.status} ${isEditing ? "editing" : ""} ${
    props.currentlyEdited ? " editor-open" : ""
  }`

  const afterMove: DraggableEventHandler = (event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: "MOVE_CAPTION", id, deltas })
  }

  const afterResize: DraggableEventHandler = (event, _data) => {
    eventHalt(event)
    dispatch({ type: "RESIZE_CAPTION", id, width, height })
  }

  const onResize: DraggableEventHandler = (event, data) => {
    eventHalt(event)
    setWidth(width + data.deltaX)
    setHeight(height + data.deltaY)
  }

  return (
    <DraggableComponent
      disabled={!isEditing}
      scale={scale}
      handle=".caption-text-move"
      onStop={afterMove}
    >
      <g className="oligrapher-caption" id={`caption-${id}`}>
        <foreignObject
          x={props.caption.x}
          y={props.caption.y}
          height={height + 5}
          width={width + 5}
        >
          <div xmlns="http://www.w3.org/1999/xhtml" className={divClassName} style={divStyle}>
            {isEditing && <CaptionTextboxEditorMenu id={id} />}
            {isEditing && <CaptionResizer afterResize={afterResize} onResize={onResize} />}
            <CaptionTextbox
              id={id}
              ref={textboxRef}
              isEditing={isEditing}
              currentlyEdited={props.currentlyEdited}
              caption={props.caption}
              status={props.status}
              height={height}
              width={width}
            />
          </div>
        </foreignObject>
      </g>
    </DraggableComponent>
  )
}
