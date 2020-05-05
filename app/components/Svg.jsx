import React from 'react'
import PropTypes from 'prop-types'

/*
  A thin abstraction over a regular dom <svg> element
*/
// eslint-disable-next-line react/display-name
const Svg = React.forwardRef((props, ref) => {
  let svgAttributes = {
    height: props.height,
    width: props.width,
    preserveAspectRatio: props.preserveAspectRatio
  }

  svgAttributes.viewBox = [
    props.viewBox.minX, props.viewBox.minY, props.viewBox.w, props.viewBox.h
  ].join(' ')

  if (props.outermost) {
    svgAttributes.xmlns = "http://www.w3.org/2000/svg"
    svgAttributes.id = "oligrapher-svg"
  }

  return (
    <svg {...svgAttributes} ref={ref}>
      {props.children}
    </svg>
  )
})

Svg.propTypes = {
  viewBox: PropTypes.shape({
    minX: PropTypes.number.isRequired,
    minY: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired
  }),
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  preserveAspectRatio: PropTypes.string.isRequired,
  outermost: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
}


Svg.defaultProps = {
  width: '100%',
  outermost: false,
  preserveAspectRatio: 'xMidYMid'
}

export default Svg
