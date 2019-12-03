import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import Edge from './Edge'

export function Edges(props) {
  return <g className="edges">
           { props.edgeIds.map(id => <Edge key={id} id={id} />) }
         </g>
}

Edges.propTypes = {
  edgeIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

const mapStateToProps = function(state) {
  return {
    edgeIds: Object.keys(state.graph.edges)
  }
}

export default connect(mapStateToProps, null, null, { areStatePropsEqual: isEqual })(Edges)
