import React from 'react'
import PropTypes from 'prop-types'

// <path
//             id={sp.pathId}
//             className="edge-line"
//             d={sp.curve}
//             stroke={sp.lineColor}
//             strokeDasharray={sp.dash}
//             strokeWidth={width}
//             fill="none"
//             markerStart={sp.markerStart}
//             markerEnd={sp.markerEnd}></path>

export default function EdgeLine(props) {
  const svgParams = props.svgParams
  const width = 1 + (props.scale - 1) * 5

  const pathAttributes = {
    id: svgParams.pathId,
    className: 'edge-path',
    d: svgParams.curve,
    stroke: svgParams.lineColor,
    strokeDasharray: svgParams.dash,
    strokeWidth: width,
    fill: "none",
    markerStart: svgParams.markerStart,
    markerEnd: svgParams.markerEnd
  }

  return <g className="edge-group">
           <path {...pathAttributes}></path>
         </g>

}

EdgeLine.propTypes = {
  svgParams: PropTypes.object.isRequired,
  scale:     PropTypes.number.isRequired

}
