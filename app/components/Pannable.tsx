import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { nanoid } from 'nanoid/non-secure'

import DraggableComponent from './DraggableComponent'

/* Allows for the maps to be panned */
/* Also allows for adding new caption by clicking background */
export function Pannable(props) {
  const {
    children, offset, zoom, isTextTool, addCaption, setOffset, clearSelection, closeEditor
  } = props
  const className = "pannable" + (isTextTool ? " text-tool" : "")

  const onClick = useCallback((event) => {
    if (isTextTool) {
      // supply caption id so that editor can be toggled
      addCaption(event, zoom)
    } else {
      clearSelection()
      closeEditor()
    }
  }, [isTextTool, zoom, addCaption, clearSelection])

  return (
    <DraggableComponent
      handle='.pannable-handle'
      position={offset}
      onStop={setOffset}
      onClick={onClick}>
      <g id="oligrapher-pannable" className={className}>
        <rect
          className="pannable-handle"
          x="-1000"
          y="-1000"
          width="2000"
          height="2000"
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
  setOffset: PropTypes.func.isRequired,
  clearSelection: PropTypes.func.isRequired,
  closeEditor: PropTypes.func.isRequired
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
    addCaption: (event, zoom) => dispatch({ type: 'ADD_CAPTION', id: nanoid(10), event, zoom }),
    setOffset: (offset) => dispatch({ type: 'SET_OFFSET', offset }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    closeEditor: () => dispatch({ type: 'CLOSE_EDITOR' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Pannable)
