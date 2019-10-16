import React from 'react'
import PropTypes from 'prop-types'
import Curve from '../../models/Curve'

const pathAttributes = curve => {
  return {
    className: 'edge-path',
    d: curve.d,
    stroke: 'black'
  }
}


export default class EdgeLine extends React.Component {
  static propTypes = {
    curve: PropTypes.instanceOf(Curve).isRequired,
  }

  render() {
    return <g className="edge-group">
             <path {...pathAttributes(this.props.curve)} >
             </path>
           </g>
  }
}
