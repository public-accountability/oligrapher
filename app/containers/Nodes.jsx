import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import Node from './Node'

export function Nodes(props) {
  return <g className="nodes">
           { props.nodeIds.map( id => <Node key={id} id={id} /> )  }
         </g>
}

Nodes.propTypes = {
  nodeIds: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = function(state) {
  return {
    nodeIds: Object.keys(state.graph.nodes)
  }
}

export default connect(mapStateToProps, null, null, { areStatePropsEqual: isEqual })(Nodes)
