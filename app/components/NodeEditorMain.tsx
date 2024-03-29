import React from "react"
import { NodeAttributes } from "../graph/node"
import { callWithTargetValue, isLittleSisId } from "../util/helpers"
import Input from "@mui/material/Input"
import Box from "@mui/material/Box"
import FormLabel from "@mui/material/FormLabel"
import { Node as NodeType } from "../graph/node"

type NodeEditorMainPropTypes = {
  node: NodeType
  updateNode: (node: NodeAttributes) => void
  openAddConnections: () => void
}

const InputGroup: React.FC = ({ children }) => <Box sx={{ m: "5px", mb: "25px" }}>{children}</Box>

export default function NodeEditorMain({
  node,
  updateNode,
  openAddConnections,
}: NodeEditorMainPropTypes) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <InputGroup>
        <FormLabel>Name</FormLabel>
        <Input
          id="oligrapher-node-editor-name"
          type="text"
          placeholder="Node name"
          value={node.name || ""}
          onChange={callWithTargetValue(name => updateNode({ name }))}
        />
      </InputGroup>

      <InputGroup>
        <FormLabel>Hover-Over Description</FormLabel>
        <Input
          id="oligrapher-node-editor-description"
          type="text"
          placeholder="Description"
          value={node.description || ""}
          onChange={callWithTargetValue(description => updateNode({ description }))}
        />
      </InputGroup>

      <InputGroup>
        <FormLabel>Clickthrough Link</FormLabel>
        <Input
          id="oligrapher-node-editor-link"
          type="url"
          placeholder="Link"
          value={node.url || ""}
          onChange={callWithTargetValue(url => updateNode({ url }))}
        />
      </InputGroup>

      <InputGroup>
        {isLittleSisId(node.id) && (
          <a className="add-connections-link" onClick={openAddConnections}>
            Add Connections +
          </a>
        )}
      </InputGroup>
    </Box>
  )
}
