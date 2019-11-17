import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pick from 'lodash/pick'

import EdgeLine from './../components/graph/EdgeLine'

export function Edge(props) {
  const edgeDomId = `edge-${props.id}`
  const edgeLineProps = pick(props, ['id', 'curve', 'scale', 'dash', 'status' ])

  return <g className="edge-group" id={edgeDomId}>
           <EdgeLine {...edgeLineProps} />
         </g>
}

Edge.propTypes = {
  id:         PropTypes.string.isRequired,
  scale:      PropTypes.number.isRequired,
  arrow:      PropTypes.string,
  label:      PropTypes.string,
  dash:       PropTypes.bool.isRequired,
  url:        PropTypes.string,
  status:     PropTypes.string.isRequired,
  curve:      PropTypes.string.isRequired
}

Edge.defaultProps = {
  dash: false
}


const mapStateToProps = (state, ownProps) => {
  let id = ownProps.id.toString()
  let edge = state.graph.edges[id]
  return { id, ...edge.display }
}

export default connect(mapStateToProps)(Edge)
