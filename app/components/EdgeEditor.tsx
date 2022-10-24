import React, { useState, useCallback } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "../util/helpers"
import EditorHotKeys from "./EditorHotKeys"
import EditorHeader from "./EditorHeader"
import EditEdgeStyle from "./EditEdgeStyle"
import EditorSubmitButtons from "./EditorSubmitButtons"
import Graph from "../graph/graph"
import type { Edge, EdgeAttributes } from "../graph/edge"
import type { Node } from "../graph/node"
import { callWithTargetValue } from "../util/helpers"
import { State } from "../util/defaultState"

type MainPagePropTypes = {
  nodes: Array<Node>
  edge: Edge
  updateEdge: (attributes: EdgeAttributes) => void
}

export function MainPage({ nodes, edge, updateEdge }: MainPagePropTypes) {
  return (
    <div data-testid="edge-editor-mainpage">
      <form>
        <div>
          <label>Label</label>
          <input
            type="text"
            placeholder="label"
            value={edge.label || ""}
            onChange={callWithTargetValue(label => updateEdge({ label }))}
          />
        </div>
      </form>

      <hr />

      <div>
        <label>Line Style</label>
      </div>

      <EditEdgeStyle edge={edge} nodes={nodes} updateEdge={updateEdge} />

      <div className="edit-edge-scale">
        <form>
          <label>Scale</label>
          <input
            type="range"
            placeholder="pixels"
            value={edge.scale}
            min="1"
            max="2.5"
            step="0.5"
            onChange={callWithTargetValue(scale => updateEdge({ scale }))}
          />
          &nbsp; <input type="text" value={edge.scale} size="2" disabled></input>
        </form>
      </div>

      <hr />

      <form>
        <div>
          <label>Clickthrough link</label>
          <input
            type="url"
            placeholder="Clickthrough link"
            value={edge.url || ""}
            onChange={callWithTargetValue(url => updateEdge({ url }))}
          />
        </div>
      </form>
    </div>
  )
}

export default function EdgeEditor({ id }: { id: string }) {
  const dispatch = useDispatch()
  const [page, setPage] = useState("main")
  const edge = useSelector<State, Edge>(state => state.graph.edges[id])
  const nodes = useSelector<State>(state => Graph.nodesOf(state.graph, id))
  const removeEdge = () => dispatch({ type: "REMOVE_EDGE", id })

  const updateEdge = (attributes: EdgeAttributes) =>
    dispatch({ type: "UPDATE_EDGE", id, attributes })

  return (
    <EditorHotKeys remove={removeEdge}>
      <div className="oligrapher-edge-editor">
        <EditorHeader title="Customize Edge" />
        <div>
          {page === "main" && (
            <MainPage edge={edge} updateEdge={updateEdge} setPage={setPage} nodes={nodes} />
          )}
        </div>
        <div>
          <EditorSubmitButtons
            hideSubmitButton={true}
            handleDelete={removeEdge}
            page={page}
            setPage={setPage}
          />
        </div>
      </div>
    </EditorHotKeys>
  )
}
