import React from 'react'

import { useSelector } from '../util/helpers'
import Node from './Node'
import FloatingMenu from '../util/floatingMenu'

export default function Nodes() {
  const nodes = useSelector(state => state.graph.nodes)
  const editedNodeId = useSelector(state => FloatingMenu.getId(state.display, 'node'))

  return (
    <g className="nodes">
      { Object.keys(nodes).map(id => (
        <Node 
          key={id} 
          node={nodes[id]} 
          currentlyEdited={id === editedNodeId} />
      )) }
    </g>
  )
}