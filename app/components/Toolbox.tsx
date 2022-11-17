import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import { MdClose } from "react-icons/md"
import { svgHeightSelector } from "../util/selectors"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"

//  This isn't a box of tools. It's a box with one tool
export default function Toolbox({ title, children }: ToolboxProps) {
  const dispatch = useDispatch()
  const closeTool = useCallback(() => dispatch({ type: "CLOSE_TOOL" }), [dispatch])
  const svgHeight = useSelector(svgHeightSelector)

  useHotkeys("escape", closeTool)

  return (
    <div
      className="oligrapher-toolbox"
      style={{ display: "flex", flexDirection: "column", maxHeight: svgHeight - 25 }}
    >
      <header style={{ display: "flex", flexDirection: "row" }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton onClick={closeTool}>
          <MdClose />
        </IconButton>
      </header>
      <main style={{ flexGrow: 1 }}>{children}</main>
    </div>
  )
}

interface ToolboxProps {
  title: string
  children: JSX.Element
}
