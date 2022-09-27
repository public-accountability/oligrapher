import React from 'react'

export function ControlPoint(props: { cx: number, cy: number, zoom: number }) {
  const radius = 2 + (props.zoom < 1 ? 2 : 0)
  return <circle cx={props.cx} cy={props.cy} r={radius} opacity="0.7" fill="#ccc" />
}
