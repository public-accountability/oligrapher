import React from 'react'
import { Node as NodeType, NODE_RADIUS } from '../graph/node'
import { NodeUIState } from '../util/NodeUIState'

const HALO_WIDTH = 6

export default function NodeHalo(props: { node: NodeType, uiState: NodeUIState }) {
  const { x, y, scale } = props.node
  const radius = NODE_RADIUS * scale

  const className = "node-halo"
    + (props.uiState.dragged ? " node-halo-dragged" : "")
    + (props.uiState.selected ? " node-halo-selected" : "")
    + (props.uiState.highlighted ? " node-halo-highlighted" : "")

  return <circle className={className} cx={x} cy={y} r={radius + HALO_WIDTH} fill="none" />
}
