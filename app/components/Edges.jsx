import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edge from './Edge'
import FloatingEditor from '../util/floatingEditor'

export function Edges({ edges, editedEdgeId, highlightedEdgeIds }) {
  return (
    <g className="edges">
      { Object.keys(edges).map(id => (
        <Edge
          key={id} 
          id={id} 
          currentlyEdited={id === editedEdgeId}
          highlighted={highlightedEdgeIds.includes(id)} />
      )) }
    </g>
  )
}

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  editedEdgeId: PropTypes.string,
  highlightedEdgeIds: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  const { list, currentIndex } = state.annotations

  return {
    edges: state.graph.edges,
    editedEdgeId: FloatingEditor.getId(state.display, 'edge'),
    highlightedEdgeIds: list[currentIndex]?.edgeIds || []
  }
}

export default connect(mapStateToProps)(Edges)