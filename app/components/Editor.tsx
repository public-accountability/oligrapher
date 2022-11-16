import React from "react"
import { useSelector } from "../util/helpers"

import NodeTool from "./NodeTool"
import TextTool from "./TextTool"
import StyleNodesTool from "./StyleNodesTool"
import InterlocksTool from "./InterlocksTool"
import InterlocksTool2 from "./InterlocksTool2"
//import OrganizeTool from './OrganizeTool'
import Settings from "./Settings"
import Editors from "./Editors"
import Help from "./Help"
import EditorMenu from "./EditorMenu"

// Container for main editing menu and tools
export function Editor() {
  const tool = useSelector(state => state.display.tool)
  const className = "oligrapher-graph-editor" + (tool === "text" ? " text-tool" : "")

  return (
    <div className={className} id="oligrapher-graph-editor">
      <EditorMenu />
      {tool === "node" && <NodeTool />}
      {tool === "text" && <TextTool />}
      {tool === "style" && <StyleNodesTool />}
      {tool === "interlocks" && <InterlocksTool2 />}
      {/* tool === 'organize' && <OrganizeTool /> */}
      {tool === "settings" && <Settings />}
      {tool === "editors" && <Editors />}
      {tool === "help" && <Help />}
    </div>
  )
}

export default Editor
