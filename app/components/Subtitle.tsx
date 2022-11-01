import React from "react"
import { callWithTargetValue } from "../util/helpers"

type SubtitlePropTypes = {
  text: string
  editable: boolean
  onChange: (value: string) => void
}

export default function Subtitle({ text, editable, onChange }: SubtitlePropTypes) {
  if (!text && !editable) {
    return null
  }

  const content = editable ? (
    <input value={text || ""} onChange={callWithTargetValue(onChange)} placeholder="Subtitle" />
  ) : (
    text
  )

  return <div id="oligrapher-header-subtitle-wrapper">{content}</div>
}
