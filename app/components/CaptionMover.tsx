import React from "react"
import { MdOpenWith } from "react-icons/md"
import { eventHalt } from "../util/helpers"

export default function () {
  return (
    <div className="caption-text-move" onClick={eventHalt}>
      <MdOpenWith />
    </div>
  )
}
