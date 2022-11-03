import React from "react"
import { DraggableCore, DraggableEventHandler } from "react-draggable"
import { MdSouthEast } from "react-icons/md"
import { useSelector } from "react-redux"
import { eventHalt } from "../util/helpers"
import { svgScaleSelector } from "../util/selectors"

type CaptionResizerProps = {
  onResize: DraggableEventHandler
  afterResize: DraggableEventHandler
}

export default function CaptionResizer(props: CaptionResizerProps) {
  const scale = useSelector(svgScaleSelector)

  return (
    <DraggableCore
      onStart={eventHalt}
      scale={scale}
      onDrag={props.onResize}
      onStop={props.afterResize}
    >
      <div className="caption-text-resize" onClick={e => e.stopPropagation()}>
        <MdSouthEast />
      </div>
    </DraggableCore>
  )
}
