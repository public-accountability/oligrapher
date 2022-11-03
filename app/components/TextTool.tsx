import React from "react"

import Toolbox from "./Toolbox"
import CaptionEditor from "./CaptionEditor"
import Box from "@mui/material/Box"
import { useSelector } from "react-redux"
import { openCaptionSelector } from "../util/selectors"

export default function TextTool() {
  const openCaption = useSelector(openCaptionSelector)

  return (
    <Toolbox title="Add Text">
      <Box>
        <div>Click anywhere to create a new caption.</div>
      </Box>
      <Box>{openCaption && <CaptionEditor id={openCaption} />}</Box>
    </Toolbox>
  )
}
