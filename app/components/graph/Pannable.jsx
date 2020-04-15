import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

const defaultClassName = 'react-draggable pannable'

/* Allows for the maps to be panned */
export default function Pannable({ scale, children }) {
  const dispatch = useDispatch()
  const setOffset = useCallback((event, data) => {
    dispatch({ type: 'SET_OFFSET', offset: { x: data.x, y: data.y } })
  }, [dispatch])

  return (
    <Draggable handle='.pannable-handle' scale={scale} defaultClassName={defaultClassName} onStop={setOffset}>
      <g>
        <rect 
          className="pannable-handle"
          x="-5000"
          y="-5000"
          width="10000"
          height="10000"
          fill="#fff" />
        {children}
      </g>
    </Draggable>
  )
}

Pannable.propTypes = {
  children: PropTypes.node.isRequired,
  scale: PropTypes.number.isRequired
}

Pannable.defaultProps = {
  scale: 1
}