import React from 'react'
import PropTypes from 'prop-types'
import EdgeModel from '../../models/Edge'

export default class Edge extends React.Component {
  static propTypes = {
    edge: PropTypes.instanceOf(EdgeModel).isRequired
  }

  render() {
    let pathAttributes = {
      className: 'edge-path',
      id: `path-${this.props.edge.id}`,
      d: "M0,0 L100,100",
      stroke: 'black'
    }

    return <g className="edge-group">
             <path {...pathAttributes} >
             </path>
           </g>
  }
}
