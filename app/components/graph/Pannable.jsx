import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import DraggableComponent from './DraggableComponent'

/* Allows for the maps to be panned */
/* Also allows for adding new caption by clicking background */
export default function Pannable({ scale, children }) {
  const dispatch = useDispatch()
  const isEditor = useSelector(state => state.display.modes.editor)
  const isTextTool = useSelector(state => state.display.editor.tool === 'text')
  const offset = useSelector(state => state.display.offset)

  const onClick = useCallback((event) => {
    console.log(event)
    if (isEditor && isTextTool) {
      dispatch({ type: 'ADD_CAPTION', event })
    }
  }, [dispatch, isEditor, isTextTool])

  const onStop = useCallback(offset => {
    dispatch({ type: 'SET_OFFSET', offset })
  }, [dispatch])

  return (
    <DraggableComponent 
      handle='.pannable-handle' 
      scale={scale} 
      position={offset} 
      onStop={onStop} 
      onClick={onClick}>
      <g className="pannable">
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