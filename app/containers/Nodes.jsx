import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import Node from './Node'

export function Nodes(props) {
  return <g className="nodes">
           { props.nodes.map( nodeId => <Node key={nodeId} id={nodeId} /> )  }
         </g>
}

Nodes.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = function(state) {
  return {
    nodes: Object.keys(state.graph.nodes)
  }
}

export default connect(mapStateToProps, null, null, { areStatePropsEqual: isEqual })(Nodes)
