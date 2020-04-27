import React from 'react'

import { useSelector } from '../util/helpers'

export default function EdgeCreationMessage() {
  const [hoveringNodeId, hoveredNodeId] = useSelector(state => state.edgeCreation.nodes)
  const hoveringNode = useSelector(state => state.graph.nodes[hoveringNodeId])
  const hoveredNode = useSelector(state => state.graph.nodes[hoveredNodeId])
  const showMessage = hoveringNode && hoveredNode
 
  return (
    <>
      { showMessage && <div className='oligrapher-edge-creation-message'>Create new edge between {hoveringNode.name} and {hoveredNode.name}</div >}
    </>
  ) 
}