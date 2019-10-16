import React, { Component } from 'react'
import PropTypes from 'prop-types'
import EdgeModel from '../../models/Edge'

import EdgeLine from './EdgeLine'

export default class Edge extends Component {
  static propTypes = {
    edge: PropTypes.instanceOf(EdgeModel).isRequired
  }

  render() {
    return <g className="edge-group">
             <EdgeLine curve={this.props.edge.curve} />
           </g>
  }
}
