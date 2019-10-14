import React from 'react'
import PropTypes from 'prop-types'
import EdgeModel from '../../models/Edge'

export default class Edge extends React.Component {
  static propTypes = {
    edge: PropTypes.instanceOf(EdgeModel).isRequired
  }

  render() {
    return <g className="edge">
           </g>

  }
}
