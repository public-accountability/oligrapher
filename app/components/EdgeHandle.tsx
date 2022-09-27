import React from 'react'
const EXTRA_WIDTH = 20

type EdgeHandleProps = {
  bezier: string,
  width: number,
  onMouseEnter: () => void,
  onMouseLeave: () => void
}


export default function EdgeHandle({ bezier, width, onMouseEnter, onMouseLeave }: EdgeHandleProps) {
  return (
    <path
      className="edge-handle"
      d={bezier}
      width={width + EXTRA_WIDTH}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      stroke="#fff"
      strokeWidth="25"
      strokeOpacity="0"
      fill="none">
    </path>
  )
}
