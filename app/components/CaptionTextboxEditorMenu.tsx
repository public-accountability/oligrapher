import React from "react"
import { eventHalt } from "../util/helpers"

import { MdOutlineModeEditOutline, MdOpenWith } from "react-icons/md"
import { useDispatch } from "react-redux"
import { IconContext } from "react-icons"

export default function CaptionTextboxEditorMenu({ id }: { id: string }) {
  const dispatch = useDispatch()

  return (
    <IconContext.Provider value={{ style: { height: "100%", width: "100%" } }}>
      <div className="caption-textbox-editor-menu">
        <div
          className="caption-text-open"
          onClick={() => dispatch({ type: "TOGGLE_CAPTION_EDITOR", id })}
        >
          <MdOutlineModeEditOutline />
        </div>
        <div className="caption-text-move" onClick={eventHalt}>
          <MdOpenWith />
        </div>
      </div>
    </IconContext.Provider>
  )
}
