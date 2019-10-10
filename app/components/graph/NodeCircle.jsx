import React from 'react'
import PropTypes from 'prop-types'
import { node as nodeDefaults } from '../../displayDefaults'

const CLASS_NAME = "node-circle"

const svgCircleAttributes = function(props) {
  return  { r:         props.radius,
            cx:        props.coords[0],
            cy:        props.coords[1],
            fill:      props.bgColor,
            className: CLASS_NAME }
}

export default function NodeCircle(props) {
  return <g className="node-circle-group">
           <circle {...svgCircleAttributes(props)} />
         </g>
}

NodeCircle.propTypes = {
  radius:     PropTypes.number.isRequired,
  coords:     PropTypes.arrayOf(PropTypes.number).isRequired,
  bgColor:    PropTypes.string.isRequired,
  draggable:  PropTypes.bool.isRequired
}

NodeCircle.defaultProps = {
  radius:     nodeDefaults.circle.radius,
  bgColor:    nodeDefaults.circle.color,
  coords:     [nodeDefaults.circle.radius, nodeDefaults.circle.radius],
  draggable:  true
}
