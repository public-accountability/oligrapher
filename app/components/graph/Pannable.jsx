import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import generate from 'shortid'

import DraggableComponent from './DraggableComponent'

/* Allows for the maps to be panned */
/* Also allows for adding new caption by clicking background */
export function Pannable({ children, offset, zoom, isTextTool, addCaption, setOffset }) {
  const className = "pannable" + (isTextTool ? " text-tool" : "")

  const onClick = useCallback((event) => {
    if (isTextTool) {
      // supply caption id so that editor can be toggled
      addCaption(event, zoom)
    }
  }, [isTextTool, zoom, addCaption])

  return (
    <DraggableComponent 
      handle='.pannable-handle' 
      position={offset}
      onStop={setOffset}
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
  scale: PropTypes.number.isRequired,
  offset: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  isTextTool: PropTypes.bool.isRequired,
  addCaption: PropTypes.func.isRequired,
  setOffset: PropTypes.func.isRequired
}

Pannable.defaultProps = {
  scale: 1
}

const mapStateToProps = state => {
  const { offset, zoom, tool } = state.display

  return {
    offset,
    zoom,
    isTextTool: tool === 'text'
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addCaption: (event, zoom) => dispatch({ type: 'ADD_CAPTION', id: generate(), event, zoom }),
    setOffset: (offset) => dispatch({ type: 'SET_OFFSET', offset })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pannable)