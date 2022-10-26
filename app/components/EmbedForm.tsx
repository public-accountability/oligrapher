import React, { useState, useRef, ReactEventHandler } from "react"
import Popover from "@mui/material/Popover"

type EmbedFormProps = {
  url: string
  open: boolean
  anchor: React.ElementType
  close: ReactEventHandler
}

export default function EmbedForm({ url, open, anchor, close }: EmbedFormProps) {
  const [width, setWidth] = useState(700)
  const [height, setHeight] = useState(600)

  const textareaRef = useRef()
  const selectAll = () => textareaRef.current.select()

  const code = `<iframe height="${height}" width="${width}" scrolling="no" style="border: 0px; overflow: hidden;" src="${url}"></iframe>`

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={close}
      anchorOrigin={{
        vertical: 40,
        horizontal: "left",
      }}
      transitionDuration={0}
    >
      <div id="oligrapher-embed-form">
        <div>
          Width:{" "}
          <input type="text" value={width} onChange={event => setWidth(event.target.value)} />
          &nbsp;&nbsp; Height:{" "}
          <input type="text" value={height} onChange={event => setHeight(event.target.value)} />
        </div>

        <textarea ref={textareaRef} onClick={selectAll} value={code} readOnly={true}></textarea>
      </div>
    </Popover>
  )
}
