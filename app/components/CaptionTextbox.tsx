import React from "react"
import { useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import { editModeSelector } from "../util/selectors"

export const styleForCaption = (caption: Caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + "px",
    fontWeight: caption.weight,
  }
}

type CaptionTextboxPropTypes = {
  currentlyEdited: boolean
  isEditing: boolean
  caption: Caption
  status: "normal" | "highlighted" | "faded"
  height: number
  width: number
}

export default function CaptionTextbox(props: CaptionTextboxPropTypes) {
  const className = `caption-text-text caption-text-${props.status}${
    props.isEditing ? " editing" : ""
  }`
  const style = {
    fontFamily: props.caption.font,
    fontSize: props.caption.size + "px",
    fontWeight: props.caption.weight,
    height: props.height + "px",
    width: props.width + "px",
  }

  return (
    <div className={className} style={style}>
      {props.caption.text}
    </div>
  )
}
