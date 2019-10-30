import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import noop from 'lodash/noop'
import Graph from '../components/graph/Graph'
import LegacyGraph from '../../legacy-app/components/Graph'

const USE_LEGACY = false

// Toggle between Legacy Graph and new graph implementation
export function GraphProxy(props) {
  if (USE_LEGACY) {
    const legacyGraphProps = {
      graph: props.graph,
      zoom: 1.2,
      viewOnlyHighlighted: false,
      isEditor: false,
      graphApi: noop,
      isLocked: false,
      clickNode: noop,
      clickCaption: noop,
      moveNode: noop,
      moveEdge: noop,
      moveCaption: noop
    }

    return <LegacyGraph {...legacyGraphProps} />
  } else {
    return <Graph {...props} />
  }

}

Graph.propTypes = {
  graph: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
  return { graph: state.graph }
}

export default connect(mapStateToProps)(GraphProxy)


/*

|div
| _____
| | Svg
| |
| |
|
|

// <circle stroke="red" cx="200" cy="200" r="50px"></circle>

*/
