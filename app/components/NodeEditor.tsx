import React, { useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import EditorHeader from "./EditorHeader"
import SizePicker from "./SizePicker"
import EditorSubmitButtons from "./EditorSubmitButtons"
import EditorHotKeys from "./EditorHotKeys"
import { isLittleSisId } from "../util/helpers"
import { IoIosLink } from "@react-icons/all-files/io/IoIosLink"

import NodeEditorImage from "./NodeEditorImage"
import NodeEditorMain from "./NodeEditorMain"
import NodeEditorColor from "./NodeEditorColor"

import { State } from "../util/defaultState"
import { Node as NodeType } from "../graph/node"
import NodeEditorSwitcher from "./NodeEditorSwitcher"

export type NodeEditorPages = "main" | "color" | "size" | "image"

export default function NodeEditor({ id }: { id: string }) {
  const [page, setPage] = useState<NodeEditorPages>("main")
  const node = useSelector<State, NodeType>(state => state.graph.nodes[id])
  const colors = useSelector(state => Object.values(state.graph.nodes).map(node => node.color))

  const dispatch = useDispatch()
  const removeNode = () => dispatch({ type: "REMOVE_NODE", id })
  const updateNode = attributes => {
    dispatch({ type: "UPDATE_NODE", id, attributes })
  }
  const handleColorChange = (color: string) => updateNode({ color })
  const handleScaleChange = scale => updateNode({ scale })
  const openAddConnections = () => dispatch({ type: "OPEN_ADD_CONNECTIONS", id })
  const isLsNode = isLittleSisId(id)

  return (
    <EditorHotKeys remove={removeNode}>
      <div className="oligrapher-node-editor">
        <EditorHeader title="Customize Node" />
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
        <footer>
          <NodeEditorSwitcher currentPage={page} setPage={setPage} />
        </footer>
      </div>
    </EditorHotKeys>
  )
}
