import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import DraggableComponent from './DraggableComponent'

/* Allows for the maps to be panned */
/* Also allows for adding new caption by clicking background */
export default function Pannable({ children }) {
  const dispatch = useDispatch()
  const isTextTool = useSelector(state => state.display.editor.tool === 'text')
  const offset = useSelector(state => state.display.offset)

  const className = "pannable" + (isTextTool ? " text-tool" : "")

  const onClick = useCallback((event) => {
    if (isTextTool) {
      dispatch({ type: 'ADD_CAPTION', event })
    }
  }, [dispatch, isTextTool])

  const onStop = useCallback(offset => {
    dispatch({ type: 'SET_OFFSET', offset })
  }, [dispatch])

  return (
    <DraggableComponent 
      handle='.pannable-handle' 
      position={offset}
      onStop={onStop} 
      onClick={onClick}>
      <g className={className}>
        <rect 
          className="pannable-handle"
          x="-5000"
          y="-5000"
          width="10000"
          height="10000"
          fill="#fff" />
        {children}
      </g>
    </DraggableComponent>
  )
}

Pannable.propTypes = {
  children: PropTypes.node.isRequired,
  scale: PropTypes.number.isRequired
}

Pannable.defaultProps = {
  scale: 1
}