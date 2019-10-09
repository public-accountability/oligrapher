import React from 'react'
import PropTypes from 'prop-types'

/*
  This renders an SVG element
*/
export default function Svg(props) {
  let svgAttributes = {
    height: props.viewPortHeight,
    width: props.viewPortWidth
  }

  svgAttributes.viewBox = [
    props.viewBoxMinX, props.viewBoxMinY, props.viewBoxWidth, props.viewBoxHeight
  ].join(' ')

  if (props.outermost) {
    svgAttributes.xmlns = "http://www.w3.org/2000/svg"
  }

  return <svg {...svgAttributes} >
           {props.children}
         </svg>
}

Svg.propTypes = {
  viewPortWidth:  PropTypes.number.isRequired,
  viewPortHeight: PropTypes.number.isRequired,
  viewBoxMinX:    PropTypes.number.isRequired,
  viewBoxMinY:    PropTypes.number.isRequired,
  viewBoxWidth:   PropTypes.number.isRequired,
  viewBoxHeight:  PropTypes.number.isRequired,
  outermost:      PropTypes.bool.isRequired,
  children:       PropTypes.node.isRequired
}


Svg.defaultProps = {
  viewBoxMinX: 0,
  viewBoxMinY: 0,
  outermost: false
}
