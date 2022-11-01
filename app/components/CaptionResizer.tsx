import React from "react"
import { DraggableCore, DraggableCoreProps, DraggableEventHandler } from "react-draggable"
import { MdSouthEast } from "react-icons/md"

export default function CaptionResizer(props: DraggableCoreProps) {
  return (
    <DraggableCore {...props}>
      <div className="caption-text-resize" onClick={e => e.stopPropagation()}>
        <MdSouthEast />
      </div>
    </DraggableCore>
  )
}
