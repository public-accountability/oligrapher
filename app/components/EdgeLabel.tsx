import React from 'react'

import { EdgeStatusType } from '../graph/edge'

export default function EdgeLabel({ id, width, bezier, status, label, scale }: EdgeLabelProps) {
  const curveId = `edge-curve-${id}`

  const color = {
    normal: "#999",
    highlighted: "#444",
    faded: "#ddd"
  }[status]

  const textProps = {
    dy: -5 - width/2,
    fill: color,
    textAnchor: "middle"
  }

  const textPathProps = {
    className: "edge-label-textpath",
    startOffset: "50%",
    href: `#${curveId}`,
    fontSize: 10 * Math.sqrt(scale)
  }

  return (
    <g className="edge-label">
      <defs>
        <path d={bezier} id={curveId}>
        </path>
      </defs>

      <text {...textProps}>
        <textPath {...textPathProps} >
          {label}
        </textPath>
      </text>
    </g>
  )
}

interface EdgeLabelProps {
  id: string,
  width: number,
  bezier: string,
  status: EdgeStatusType,
  label: string,
  scale: number
}
