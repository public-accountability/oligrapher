import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edge from './Edge'
import FloatingEditor from '../util/floatingEditor'
import { calculateStatus } from '../util/helpers'
import { annotationHasHighlightsSelector } from '../util/selectors'

export function Edges(props) {
  const { 
    edges, editedEdgeId, highlightedEdgeIds, annotationHasHighlights, editMode 
  } = props

  return (
    <g className="edges">
      { Object.keys(edges).map(id => (
        <Edge
          key={id} 
          id={id} 
          currentlyEdited={id === editedEdgeId}
          status={calculateStatus(id, highlightedEdgeIds, annotationHasHighlights, editMode)} />
      )) }
    </g>
  )
}

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  editedEdgeId: PropTypes.string,
  highlightedEdgeIds: PropTypes.array.isRequired,
  annotationHasHighlights: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired
}

const mapStateToProps = state => {
  const storyMode = state.display.modes.story
  const { list, currentIndex } = state.annotations

  return {
    edges: state.graph.edges,
    editedEdgeId: FloatingEditor.getId(state.display, 'edge'),
    highlightedEdgeIds: storyMode ? (list[currentIndex]?.edgeIds || []) : [],
    annotationHasHighlights: annotationHasHighlightsSelector(state),
    editMode: state.display.modes.editor
  }
}

export default connect(mapStateToProps)(Edges)