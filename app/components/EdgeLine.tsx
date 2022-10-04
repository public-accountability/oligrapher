import React from 'react'

import { EdgeStatusType } from '../graph/edge'
import Arrow, { ArrowType } from '../graph/arrow'

export function EdgeLine({ id, bezier, width, dash, status, arrow, isReverse }: EdgeLineProps) {
  const color = {
    normal: "#999",
    highlighted: "#444",
    selected: "#444",
    faded: "#ddd"
  }[status]

  return (
    <path
      id={`path-${id}`}
      className={`edge-path edge-path-${status}`}
      d={bezier}
      strokeWidth={width}
      strokeDasharray={dash ? "5 5" : ''}
      stroke={color}
      fill="none"
      markerStart={Arrow.marker.start(arrow, isReverse, status)}
      markerEnd={Arrow.marker.end(arrow, isReverse, status)}>
    </path>
  )
}

interface EdgeLineProps {
  id: string,
  bezier: string,
  scale: number,
  dash: boolean,
  status: EdgeStatusType,
  width: number,
  arrow: ArrowType,
  isReverse: boolean
}

export default React.memo(EdgeLine)
