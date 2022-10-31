import React from "react"
import { Caption } from "../graph/caption"

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
  const id = props.caption.id

  return (
    <g className="oligrapher-caption" id={`caption-${id}`}>
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
  )
}
