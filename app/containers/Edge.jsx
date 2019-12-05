import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pick from 'lodash/pick'

import Curve from '../graph/curve'

import EdgeLine from './../components/graph/EdgeLine'

export function Edge(props) {
  const edgeDomId = `edge-${props.id}`

  const geometry = Curve.calculateGeometry(props)
  const curve = Curve.curveFromGeometry(geometry)
  const edgeLineProps = { ...pick(props, ['id', 'scale', 'dash', 'status']), curve }

  return <g className="edge-group" id={edgeDomId}>
           <EdgeLine {...edgeLineProps} />
         </g>
}

Edge.propTypes = {
  id:         PropTypes.string.isRequired,
  node1_id:   PropTypes.string.isRequired,
  node2_id:   PropTypes.string.isRequired,
  // display
  scale:      PropTypes.number.isRequired,
  arrow:      PropTypes.string,
  label:      PropTypes.string,
  dash:       PropTypes.bool.isRequired,
  url:        PropTypes.string,
  status:     PropTypes.string.isRequired,
  // geometry
  x1:         PropTypes.number.isRequired,
  y1:         PropTypes.number.isRequired,
  x2:         PropTypes.number.isRequired,
  y2:         PropTypes.number.isRequired,
  cx:         PropTypes.number.isRequired,
  cy:         PropTypes.number.isRequired,
  s1:         PropTypes.number.isRequired,
  s2:         PropTypes.number.isRequired
}

Edge.defaultProps = {
  dash: false
}

const mapStateToProps = (state, ownProps) => {
  let id = ownProps.id.toString()
  return state.graph.edges[id]
}

export default connect(mapStateToProps)(Edge)
