import React from "react"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import type { LsNode } from "../datasources/littlesis3"
import { useDispatch } from "react-redux"

function NodeListItem({ node }) {
  const dispatch = useDispatch()

  return (
    <ListItemButton
      alignItems="flex-start"
      dense={true}
      onClick={() => dispatch({ type: "ADD_INTERLOCKS_NODE", id: node.id })}
    >
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
