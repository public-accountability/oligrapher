import React from 'react'
import PropTypes from 'prop-types'

import Arrow from '../../graph/arrow'
import { stringOrNumber } from '../../util/types'

//const DASH_PARAMS = "5, 2"

const LINE_COLOR = {
  normal: "#999",
  highlighted: "#999",
  faded: "#ddd"
}

export default function EdgeLine(props) {
  // const strokeDasharray = props.dash ?  : ''
  // const dy = -6 * Math.sqrt(props.scale)

  const attributes = {
    id: `path-${props.id}`,
    className: 'edge-path',
    d: props.curve,
    strokeWidth: props.width,
    strokeDasharray: props.dash || '',
    stroke: LINE_COLOR[props.status],
    fill: "none",
    markerStart: Arrow.marker.start(props.arrow, props.isReverse),
    markerEnd: Arrow.marker.end(props.arrow, props.isReverse),
  }

  return <path {...attributes}></path>
}


EdgeLine.propTypes = {
  id:        stringOrNumber.isRequired,
  curve:     PropTypes.string.isRequired,
  scale:     PropTypes.number.isRequired,
  dash:      PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  status:    PropTypes.string.isRequired,
  width:     PropTypes.number.isRequired,
  arrow:     PropTypes.string,
  isReverse: PropTypes.bool.isRequired
}

// export default React.memo(EdgeLine)
