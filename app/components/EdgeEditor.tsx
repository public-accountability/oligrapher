import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Input from "@mui/material/Input"
import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"
import Typography from "@mui/material/Typography"

import EditorHotKeys from "./EditorHotKeys"
import EditorHeader from "./EditorHeader"
import EditEdgeStyle from "./EditEdgeStyle"
import EditorSubmitButtons from "./EditorSubmitButtons"
import Graph from "../graph/graph"
import type { Edge, EdgeAttributes } from "../graph/edge"
import { State } from "../util/defaultState"

export default function EdgeEditor({ id }: { id: string }) {
  const dispatch = useDispatch()
  const edge = useSelector<State, Edge>(state => state.graph.edges[id])
  const nodes = useSelector<State>(state => Graph.nodesOf(state.graph, id))
  const removeEdge = () => dispatch({ type: "REMOVE_EDGE", id })

  const updateEdge = (attributes: EdgeAttributes) =>
    dispatch({ type: "UPDATE_EDGE", id, attributes })

  return (
    <EditorHotKeys remove={removeEdge}>
      <div className="oligrapher-edge-editor" data-testid="oligrapher-edge-editor">
        <EditorHeader title="Customize Edge" />

        <Box sx={{ m: "5px", mb: "25px" }}>
          <Input
            type="text"
            placeholder="label"
            value={edge?.label}
            onChange={event => updateEdge({ label: event.target.value })}
          />
        </Box>

        <Box>
          <EditEdgeStyle edge={edge} nodes={nodes} updateEdge={updateEdge} />
        </Box>

        <Box sx={{ width: 200, ml: "5px" }}>
          <Typography id="edge-scale-slider-label" gutterBottom>
            Scale <em>{edge.scale}x</em>
          </Typography>
          <Slider
            aria-labelledby="edge-scale-slider-label"
            aria-label="Edge scale"
            min={1}
            max={4}
            step={0.5}
            value={edge.scale}
            onChange={event => updateEdge({ scale: event.target.value })}
          />
        </Box>

        <Box sx={{ m: "5px", mb: "25px" }}>
          <Input
            type="url"
            placeholder="Clickthrough link"
            value={edge.url || ""}
            onChange={event => updateEdge({ url: event.target.value })}
          />
        </Box>

        <Box>
          <EditorSubmitButtons hideSubmitButton={true} handleDelete={removeEdge} page="main" />
        </Box>
      </div>
    </EditorHotKeys>
  )
}
