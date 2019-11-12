import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import NodeCircle from './../components/graph/NodeCircle'

import merge from 'lodash/merge'
import pick from 'lodash/pick'

const DEFAULT_COLOR = "#ccc"

export function Node(props) {
  return <g id={"node" + props.id} className="oligrapher-node">
           <NodeCircle {...pick(props, ['x', 'y', 'scale', 'color'])} />
         </g>
}

Node.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  name: PropTypes.string,
  url: PropTypes.string,
  color: PropTypes.string,
  status: PropTypes.string.isRequired
}

Node.defaultProps = {
  color: DEFAULT_COLOR
}


const mapStateToProps = (state, ownProps) => {
  const id = ownProps.id.toString()
  const node = state.graph.nodes[id]

  return merge({id: id}, node.display)

}

export default connect(mapStateToProps)(Node)
