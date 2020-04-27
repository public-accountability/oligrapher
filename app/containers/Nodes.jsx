import React from 'react'
import { useSelector } from 'react-redux'

import Node from './Node'

export default function Nodes() {
  const nodeIds = useSelector(state => Object.keys(state.graph.nodes))

  return (
    <g className="nodes">
      { nodeIds.map( id => <Node key={id} id={id} /> )  }
    </g>
  )
}