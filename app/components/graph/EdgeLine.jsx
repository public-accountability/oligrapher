import React from 'react'
import PropTypes from 'prop-types'

const DASH_PARAMS = "5, 2"

const DISPLAY =  {
  lineColor: {
    normal: "#999",
    highlighted: "#999",
    faded: "#ddd"
  },
  textColor: {
    normal: "#999",
    highlighted: "#444",
    faded: "#ddd"
  },
  bgColor: {
    normal: "#fff",
    highlighted: "#ff0",
    faded: "#fff"
  },
  bgOpacity: {
    normal: 0,
    highlighted: 0.5,
    faded: 0
  }
}

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

// markerStart: svgParams.markerStart,
// markerEnd: svgParams.markerEnd

export default function EdgeLine(props) {
  const dy = -6 * Math.sqrt(props.scale)
  const strokeDasharray = props.dash ? DASH_PARAMS : ''

  const attributes = {
    id: `path-${props.id}`,
    className: 'edge-path',
    d: props.curve,
    dy: dy,
    strokeWidth: props.width,
    strokeDasharray: strokeDasharray,
    stroke: DISPLAY.lineColor[props.status],
    lineColor: DISPLAY.lineColor[props.status],
    textColor: DISPLAY.textColor[props.status],
    bgColor: DISPLAY.bgColor[props.status],
    bgOpacity: DISPLAY.bgOpacity[props.status],
    fill: "none"
  }

  return <path {...attributes}></path>
}


EdgeLine.propTypes = {
  id:       PropTypes.string.isRequired,
  curve:    PropTypes.string.isRequired,
  scale:    PropTypes.number.isRequired,
  dash:     PropTypes.bool.isRequired,
  status:   PropTypes.string.isRequired,
  width:    PropTypes.number.isRequired
}


// export default React.memo(EdgeLine)
