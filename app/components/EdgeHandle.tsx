import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'

const EXTRA_WIDTH = 20

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

interface EdgeHandleProps {
  bezier: string,
  width: number,
  onMouseEnter: () => void,
  onMouseLeave: () => void
}