import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export function EdgeCreationMessage({ hoveringNode, hoveredNode }) {
  const showMessage = hoveringNode && hoveredNode
 
  return (
    <>
      { showMessage && <div className='oligrapher-edge-creation-message'>Create new edge between {hoveringNode.name} and {hoveredNode.name}</div >}
    </>
  ) 
}

EdgeCreationMessage.propTypes = {
  hoveringNode: PropTypes.object,
  hoveredNode: PropTypes.object
}

const mapStateToProps = (state) => { 
  let [hoveringNodeId, hoveredNodeId] = state.edgeCreation.nodes

  return {
    hoveringNode: state.graph.nodes[hoveringNodeId],
    hoveredNode: state.graph.nodes[hoveredNodeId]
  }
}

export default connect(mapStateToProps)(EdgeCreationMessage)