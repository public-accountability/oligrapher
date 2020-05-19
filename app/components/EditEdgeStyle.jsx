import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import EdgeEditorNode from './EdgeEditorNode'
import Arrow from '../graph/arrow'

export default function EditEdgeStyle({ edge, nodes, updateEdge }) {
  const { node1, node2 } = Arrow.parse(edge.arrow)
  const leftArrow = node1 ? "←" : "─"
  const rightArrow = node2 ? "→" : "─"
  const dash = edge.dash ? "┄┄" : "──"

  const toggleLeftArrow = useCallback(() => {
    const arrow = Arrow.change(edge.arrow, !node1, '1')
    updateEdge({ arrow })
  }, [edge, updateEdge, node1])

  const toggleRightArrow = useCallback(() => {
    const arrow = Arrow.change(edge.arrow, !node2, '2')
    updateEdge({ arrow })
  }, [edge, updateEdge, node2])

  const toggleDash = useCallback(() => {
    const dash = !edge.dash
    updateEdge({ dash })
  }, [edge, updateEdge])

  return (
    <div className="edit-edge-style">
      <div>
        <EdgeEditorNode node={nodes[0]} />
      </div>
      <div> 
        <button className="edge-style-button" onClick={toggleLeftArrow} title="Toggle arrow">{leftArrow}</button>
        <button className="edge-style-button" onClick={toggleDash} title="Toggle dashes">{dash}</button>
        &nbsp;
        <button className="edge-style-button" onClick={toggleRightArrow} title="Toggle arrow">{rightArrow}</button>
        <br />
        <small>toggle dashes and arrows</small>
      </div>
      <div>
        <EdgeEditorNode node={nodes[1]} />
      </div>
    </div>
  )
}

EditEdgeStyle.propTypes = {
  edge: PropTypes.object.isRequired,
  nodes: PropTypes.array.isRequired,
  updateEdge: PropTypes.func.isRequired
}