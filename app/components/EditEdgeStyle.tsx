import React, { useCallback } from "react"
import EdgeEditorNode from "./EdgeEditorNode"
import Arrow from "../graph/arrow"
import type { Edge, EdgeAttributes } from "../graph/edge"
import type { Node } from "../graph/node"

type EditEdgeStylePropTypes = {
  edge: Edge
  nodes: Array<Node>
  updateEdge: (attributes: EdgeAttributes) => void
}

export default function EditEdgeStyle({ edge, nodes, updateEdge }: EditEdgeStylePropTypes) {
  const { node1, node2 } = Arrow.parse(edge.arrow)
  const leftArrow = node1 ? "←" : "―"
  const rightArrow = node2 ? "→" : "―"
  const dash = edge.dash ? "---" : "―"

  const toggleLeftArrow = useCallback(() => {
    const arrow = Arrow.change(edge.arrow, !node1, "1")
    updateEdge({ arrow })
  }, [edge, updateEdge, node1])

  const toggleRightArrow = useCallback(() => {
    const arrow = Arrow.change(edge.arrow, !node2, "2")
    updateEdge({ arrow })
  }, [edge, updateEdge, node2])

  const toggleDash = useCallback(() => {
    const dash = !edge.dash
    updateEdge({ dash })
  }, [edge, updateEdge])

  return (
    <div className="edit-edge-style">
      <div>
        <EdgeEditorNode node={nodes[0]} />
      </div>
      <div className="edge-style-buttons">
        <button className="edge-style-button" onClick={toggleLeftArrow} title="Toggle arrow">
          {leftArrow}
        </button>
        &nbsp;
        <button className="edge-style-button" onClick={toggleDash} title="Toggle dashes">
          {dash}
        </button>
        &nbsp;
        <button className="edge-style-button" onClick={toggleRightArrow} title="Toggle arrow">
          {rightArrow}
        </button>
        <br />
        <small>toggle dashes and arrows</small>
      </div>
      <div>
        <EdgeEditorNode node={nodes[1]} />
      </div>
    </div>
  )
}
