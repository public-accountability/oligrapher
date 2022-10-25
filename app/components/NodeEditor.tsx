import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"

import EditorHeader from "./EditorHeader"
import SizePicker from "./SizePicker"
import EditorHotKeys from "./EditorHotKeys"
import NodeEditorImage from "./NodeEditorImage"
import NodeEditorMain from "./NodeEditorMain"
import NodeEditorColor from "./NodeEditorColor"
import { NodeAttributes } from "../graph/node"
import { State } from "../util/defaultState"
import { Node as NodeType } from "../graph/node"
import NodeEditorSwitcher from "./NodeEditorSwitcher"

export type NodeEditorPages = "main" | "color" | "size" | "image"

export default function NodeEditor({ id }: { id: string }) {
  const [page, setPage] = useState<NodeEditorPages>("main")
  const node = useSelector<State, NodeType>(state => state.graph.nodes[id])
  const colors = useSelector<State, string[]>(state =>
    Object.values(state.graph.nodes).map(node => node.color)
  )

  const dispatch = useDispatch()
  const removeNode = () => dispatch({ type: "REMOVE_NODE", id })
  const updateNode = (attributes: NodeAttributes) => {
    dispatch({ type: "UPDATE_NODE", id, attributes })
  }
  const handleColorChange = (color: string) => updateNode({ color })
  const handleScaleChange = scale => updateNode({ scale })
  const openAddConnections = () => dispatch({ type: "OPEN_ADD_CONNECTIONS", id })

  return (
    <EditorHotKeys remove={removeNode}>
      <div className="oligrapher-node-editor">
        <EditorHeader title="Customize Node" />
        <NodeEditorSwitcher currentPage={page} setPage={setPage} />
        <main>
          {page === "main" && (
            <NodeEditorMain
              node={node}
              setPage={setPage}
              updateNode={updateNode}
              openAddConnections={openAddConnections}
            />
          )}
          {page === "color" && (
            <NodeEditorColor color={node.color} onChange={handleColorChange} colors={colors} />
          )}
          {page === "size" && <SizePicker scale={node.scale} onChange={handleScaleChange} />}
          {page === "image" && <NodeEditorImage id={id} image={node.image} />}
        </main>
      </div>
    </EditorHotKeys>
  )
}
