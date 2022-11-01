import React from "react"
import { Node as NodeType, NODE_RADIUS } from "../graph/node"

export function NodeBgCircle({ node }: { node: NodeType }) {
  const { x, y, scale } = node
  const radius = NODE_RADIUS * scale

  return <circle className="node-bg-circle" cx={x} cy={y} r={radius} fill="#fff" />
}

export default React.memo(NodeBgCircle)
