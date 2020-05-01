import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edge from './Edge'
import FloatingMenu from '../util/floatingMenu'

export const Edges = React.forwardRef(function Func({ edges, editedEdgeId }, ref) {
  return (
    <g className="edges">
      { Object.keys(edges).map(id => (
        <Edge
          ref={ref}
          key={id} 
          id={id} 
          currentlyEdited={id === editedEdgeId} />
      )) }
    </g>
  )
})

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  editedEdgeId: PropTypes.string
}

const mapStateToProps = state => {
  return {
    edges: state.graph.present.edges,
    editedEdgeId: FloatingMenu.getId(state.display, 'edge')  
  }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(Edges)