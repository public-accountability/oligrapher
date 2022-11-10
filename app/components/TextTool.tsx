import React from "react"

import Toolbox from "./Toolbox"
import CaptionEditor from "./CaptionEditor"
import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import { openCaptionSelector } from "../util/selectors"

export default function TextTool() {
  const openCaption = useSelector(openCaptionSelector)

  const text = openCaption ? "Edit caption" : "Click anywhere to create a new caption"

  return (
    <Toolbox title="Add Text">
      <Box>
        <div>{text}</div>
      </Box>
      <Box>{openCaption && <CaptionEditor id={openCaption} />}</Box>
    </Toolbox>
  )
}
