import React from "react"
import { useDispatch } from "react-redux"
import Paper from "@mui/material/Paper"
import { MdClose } from "react-icons/md"

export default function HelpTool() {
  const dispatch = useDispatch()

  return (
    <Paper id="oligrapher-help" elevation={3}>
      <header>
        User Guide
        <button onClick={() => dispatch({ type: "CLOSE_TOOL" })}>
          <MdClose />
        </button>
      </header>
    </Paper>
  )
}
