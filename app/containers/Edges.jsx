import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edge from './Edge'
import FloatingMenu from '../util/floatingMenu'

export function Edges({ edges, editedEdgeId }) {
  return (
    <g className="edges">
      { Object.keys(edges).map(id => (
        <Edge
          key={id} 
          id={id} 
          currentlyEdited={id === editedEdgeId} />
      )) }
    </g>
  )
}

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  editedEdgeId: PropTypes.string
}

const mapStateToProps = state => {
  return {
    edges: state.graph.edges,
    editedEdgeId: FloatingMenu.getId(state.display, 'edge')  
  }
}

export default connect(mapStateToProps)(Edges)