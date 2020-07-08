import React from 'react'
import { useSelector } from 'react-redux'

import { StateWithHistory } from '../util/defaultState'
import { EdgeStatusType } from '../graph/edge'

export default function EdgeLabel({ id, width, bezier, status, label, scale }: EdgeLabelProps) {
  const editMode = useSelector<StateWithHistory>(state => state.display.modes.editor)
  const curveId = `edge-curve-${id}`

  const color = {
    normal: "#444",
    selected: "#000",
    highlighted: "#000",
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
    fontSize: 10 * Math.sqrt(scale),
    fontFamily: "Helvetica, Arial, sans-serif"
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
