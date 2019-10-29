import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// import Node from '../components/graph/Node'
import Node from './Node'

export class Nodes extends Component {
  static propTypes = {
    nodes: PropTypes.array.isRequired
  }

  render() {
    return this.props.nodes.map(n => <Node key={n.id} nodeId={n.id} />)
  }
}


const mapStateToProps = function(state) {
  return {
    "nodes": Object.values(state.graph.nodes)
  }
}

export default connect(mapStateToProps)(Nodes)
