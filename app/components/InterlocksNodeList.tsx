import React from "react"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import type { LsNode } from "../datasources/littlesis3"

function NodeListItem({ node }: { node: LsNode }) {
  const addInterlocksNode = () => {
    console.log("Add this node to the map ", node.id)
  }

  return (
    <ListItemButton alignItems="flex-start" dense={true} onClick={addInterlocksNode}>
      <ListItemText primary={node.name} secondary={node.description} />
    </ListItemButton>
  )
}

export default function InterlocksNodeList({ nodes }: { nodes: LsNode[] }) {
  return (
    <List className="oligrapher-interlocks-node-list">
      {nodes.map(n => (
        <NodeListItem key={n.id} node={n} />
      ))}
    </List>
  )
}
