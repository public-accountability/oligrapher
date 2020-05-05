import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Node from './Node'
import FloatingEditor from '../util/floatingEditor'

export function Nodes({ nodes, editedNodeId, draggedNodeId }) {
  // reorder so that dragged node is painted first
  const nonDraggedNodeIds = Object.keys(nodes).filter(id => id !== draggedNodeId)
  const nodeIds = (draggedNodeId ? [draggedNodeId] : []).concat(nonDraggedNodeIds)

  return (
    <g className="nodes">
      { nodeIds.map(id => (
        <Node 
          key={id} 
          id={id} 
          currentlyEdited={id === editedNodeId} />
      )) }
    </g>
  )
}

Nodes.propTypes = {
  nodes: PropTypes.object.isRequired,
  editedNodeId: PropTypes.string,
  draggedNodeId: PropTypes.string
}

const mapStateToProps = state => {
  return {
    nodes: state.graph.nodes,
    editedNodeId: FloatingEditor.getId(state.display, 'node'),
    draggedNodeId: state.display.draggedNode ? state.display.draggedNode.id : null
  }
}

export default connect(mapStateToProps)(Nodes)