import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

import { classNames } from '../util/helpers'
import Node from './Node'

export function Nodes(props) {
  return (
    <g className={props.className}>
      { props.nodeIds.map( id => <Node key={id} id={id} /> )  }
    </g>
  )
}

Nodes.propTypes = {
  nodeIds: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string.isRequired
}

const mapStateToProps = function(state) {
  const edgeToolOpen = state.display.editor.tool === 'edge'
  const className = classNames('nodes', edgeToolOpen ? 'edge-tool-open' : null)

  return {
    nodeIds: Object.keys(state.graph.nodes),
    className: className
  }
}

export default connect(mapStateToProps, null, null, { areStatePropsEqual: isEqual })(Nodes)
