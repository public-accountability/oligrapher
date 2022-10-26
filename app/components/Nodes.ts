import React from "react"
import { useSelector } from "react-redux"
import { State } from "../util/defaultState"
import Node from "./Node"

function getNodeIds(state: State): string[] {
  const draggedNode = state.display.draggedNode

  if (draggedNode) {
    return [draggedNode].concat(Object.keys(state.graph.nodes).filter(id => id !== draggedNode))
  } else {
    return Object.keys(state.graph.nodes)
  }
}

export default function Nodes() {
  const nodeIds = useSelector<State, string[]>(getNodeIds)
  const nodes = nodeIds.map(id => React.createElement(Node, { id, key: id }))
  return React.createElement("g", { className: "nodes" }, nodes)
}
