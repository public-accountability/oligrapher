import React from 'react'
import PropTypes from 'prop-types'

const TEXT_COLOR = {
  normal: "#999",
  highlighted: "#444",
  faded: "#ddd"
}

export default function EdgeLabel(props) {
  const curveId = `edge-curve-${props.id}`

  const textProps = {
    dy: -5 - props.width/2,
    fill: TEXT_COLOR[props.status],
    textAnchor: "middle"
  }

  const textPathProps = {
    classname: "edge-label-textpath",
    startOffset: "50%",
    href: `#${curveId}`,
    fontSize: 10 * Math.sqrt(props.scale)
  }

  return <g className="edge-label">
           <defs>
             <path d={props.curve} id={curveId}>
             </path>
           </defs>

           <text {...textProps}>
             <textPath {...textPathProps} >
               {props.label}
             </textPath>
           </text>
         </g>
}

EdgeLabel.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  curve: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired
}
