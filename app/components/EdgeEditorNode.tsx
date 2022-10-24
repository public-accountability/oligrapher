import React from "react"
import type { Node } from "../graph/node"
import NodeCircle from "./NodeCircle"
import NodeLabel from "./NodeLabel"

const nodeUIState = {
  dragged: false,
  edited: true,
  selected: false,
  highlighted: false,
  appearance: "normal",
}

export default function EdgeEditorNode({ node }: { node: Node }) {
  const nodeCopy = Object.assign({}, node, { x: 40, y: 20, scale: 2 / 3 })

  return (
    <svg
      id="svg"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="80px"
      height="90px"
      preserveAspectRatio="xMidYMid"
    >
      <NodeCircle node={nodeCopy} uiState={nodeUIState} />
      <NodeLabel node={nodeCopy} uiState={nodeUIState} perLineMax={15} />
    </svg>
  )
}
