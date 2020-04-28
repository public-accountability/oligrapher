import React from 'react'
import { useSelector } from 'react-redux'

import Edge from './Edge'
import FloatingMenu from '../util/floatingMenu'

export default function Edges() {
  const edges = useSelector(state => state.graph.edges)
  const editedEdgeId = useSelector(state => FloatingMenu.getId(state, 'node'))

  return (
    <g className="edges">
      { Object.keys(edges).map(id => (
        <Edge 
          key={id} 
          edge={edges[id]} 
          currentlyEdited={id === editedEdgeId} />
      )) }
    </g>
  )
}