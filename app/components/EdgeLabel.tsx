import React from "react"
import { EdgeStatusType } from "../graph/edge"
import ConditionalLink from "./ConditionalLink"

interface EdgeLabelProps {
  id: string
  width: number
  bezier: string
  status: EdgeStatusType
  label: string
  scale: number
  showLink: boolean
  url?: string
}

function EdgeLabel({ id, width, bezier, status, label, scale, showLink, url }: EdgeLabelProps) {
  const curveId = `edge-curve-${id}`

  const color = {
    normal: "#444",
    selected: "#000",
    highlighted: "#000",
    faded: "#ddd",
  }[status]

  const textProps = {
    dy: -5 - width / 2,
    fill: color,
    textAnchor: "middle",
  }

  const textPathProps = {
    className: "edge-label-textpath",
    startOffset: "50%",
    href: `#${curveId}`,
    fontSize: 10 * Math.sqrt(scale),
    // fontFamily: "Helvetica, Arial, sans-serif"
  }

  return (
    <ConditionalLink condition={showLink} url={url}>
      <g className="edge-label">
        <defs>
          <path d={bezier} id={curveId}></path>
        </defs>

        <text {...textProps}>
          <textPath {...textPathProps}>{label}</textPath>
        </text>
      </g>
    </ConditionalLink>
  )
}

export default React.memo(EdgeLabel)
