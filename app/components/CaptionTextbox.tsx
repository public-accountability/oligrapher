import React from "react"
import { useSelector } from "react-redux"
import { Caption } from "../graph/caption"
import { editModeSelector } from "../util/selectors"

export const styleForCaption = (caption: Caption) => {
  return {
    fontFamily: caption.font,
    fontSize: caption.size + "px",
    fontWeight: caption.weight,
    height: caption.height + "px",
    width: caption.width + "px",
  }
}

type CaptionTextboxPropTypes = {
  caption: Caption
  status: string
}

export default function CaptionTextbox({ caption, status }: CaptionTextboxPropTypes) {
  const style = styleForCaption(caption)
  const editMode = useSelector(editModeSelector)
  const className = `caption-text caption-text-${status}` + (editMode ? " editing" : "")

  return (
    <div xmlns="http://www.w3.org/1999/xhtml" className={className} style={style}>
      {caption.text}
    </div>
  )
}
