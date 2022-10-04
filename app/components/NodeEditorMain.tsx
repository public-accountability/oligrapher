import React from "react"
import { NodeAttributes } from "../graph/node"
import { callWithTargetValue, isLittleSisId } from "../util/helpers"
import Input from "@mui/material/Input"
import NodeStyleForm from "./NodeStyleForm"

type NodeEditorMainPropTypes = {
  node: {
    id: string
    name?: string
    description?: string
    image?: string
    url?: string
  }
  setPage: (page: string) => void
  updateNode: (node: NodeAttributes) => void
  openAddConnections: () => void
}

export default function NodeEditorMain({
  node,
  setPage,
  updateNode,
  openAddConnections,
}: NodeEditorMainPropTypes) {
  const isLsNode = isLittleSisId(node.id)

  return (
    <>
      <form>
        <div>
          <label>Name</label>
          <Input
            type="text"
            placeholder="Node name"
            value={node.name || ""}
            onChange={callWithTargetValue(name => updateNode({ name }))}
          />
        </div>

        <div>
          <label>Hover-Over Description</label>
          <Input
            type="text"
            placeholder="Description"
            value={node.description || ""}
            onChange={callWithTargetValue(description => updateNode({ description }))}
          />
        </div>

        <div>
          <label>Clickthrough Link</label>
          <Input
            type="text"
            placeholder="Link"
            value={node.url || ""}
            onChange={callWithTargetValue(url => updateNode({ url }))}
          />
        </div>
      </form>
      <hr />
      <NodeStyleForm setPage={setPage} />
      <hr />
      {isLsNode && (
        <a className="add-connections-link" onClick={openAddConnections}>
          Add Connections +
        </a>
      )}
    </>
  )
}
