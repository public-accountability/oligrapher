import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Node from './Node'
import FloatingMenu from '../util/floatingMenu'

export function Nodes({ nodes, editedNodeId }) {

  return (
    <g className="nodes">
      { Object.keys(nodes).map(id => (
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
  editedNodeId: PropTypes.string
}

const mapStateToProps = state => {
  return {
    nodes: state.graph.present.nodes,
    editedNodeId: FloatingMenu.getId(state.display, 'node')
  }
}

export default connect(mapStateToProps)(Nodes)