import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import curry from 'lodash/curry'
import { edgeProps } from '../graph/edge'
import Edge from '../components/graph/Edge'

const renderEdge = function(nodes, edge) {
  return <Edge {...edgeProps(nodes, edge)} />
}

export function Edges({nodes, edges}) {
  return edges.map(curry(renderEdge)(nodes))
}

Edges.propTypes = {
  edges: PropTypes.array.isRequired,
  nodes: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
  return { "nodes": state.graph.nodes,
           "edges": Object.values(state.graph.edges) }
}

export default connect(mapStateToProps)(Edges)
