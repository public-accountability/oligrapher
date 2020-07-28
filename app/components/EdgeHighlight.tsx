import React from 'react'

export function EdgeHighlight({ bezier, width }: EdgeHighlightProps) {
  return (
    <path
      className="edge-highlight"
      d={bezier}
      strokeWidth={width * 4}
      stroke="#ffff00"
      fill="none">
    </path>
  )
}


interface EdgeHighlightProps {
  bezier: string,
  width: number
}

export default React.memo(EdgeHighlight)
