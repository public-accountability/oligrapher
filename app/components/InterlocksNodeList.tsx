import React from "react"

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"

import type { LsNode } from "../datasources/littlesis3"

function NodeListItem({ node }: { node: LsNode }) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemText primary={node.name} secondary={node.description} />
    </ListItem>
  )
}

export default function InterlocksNodeList({ nodes }: { nodes: LsNode[] }) {
  return (
    <List sx={{ width: "100%" }}>
      {nodes.map(n => (
        <NodeListItem node={n} />
      ))}
    </List>
  )
}
