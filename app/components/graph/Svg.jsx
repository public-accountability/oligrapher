import React from 'react'
import PropTypes from 'prop-types'

/*
  This renders an SVG element
*/
export default function Svg(props) {
  let svgAttributes = {
    height: props.height,
    width: props.width,
  }

  svgAttributes.viewBox = [
    props.viewBox.minX, props.viewBox.minY, props.viewBox.w, props.viewBox.h
  ].join(' ')

  if (props.outermost) {
    svgAttributes.xmlns = "http://www.w3.org/2000/svg"
  }

  return <svg {...svgAttributes} >
           {props.children}
         </svg>
}

Svg.propTypes = {
  viewBox: PropTypes.shape({
    minX: PropTypes.number.isRequired,
    minY: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired
  }),
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  outermost:      PropTypes.bool.isRequired,
  children:       PropTypes.node.isRequired
}


Svg.defaultProps = {
  height: '500px',
  width: '100%',
  outermost: false
}
