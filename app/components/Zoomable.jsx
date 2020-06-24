import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import noop from 'lodash/noop'

export default function Zoomable({ zoom, children }) {
  const dispatch = useDispatch()
  const { scrollToZoom } = useSelector(state => state.attributes.settings)
  const editMode = useSelector(state => state.display.modes.editor)

  const onWheel = useCallback(event => {
    event.preventDefault()

    if (event.deltaY > 0) {
      dispatch({ type: 'ZOOM_IN', interval: 1.1 })
    } else if (event.deltaY < 0) {
      dispatch({ type: 'ZOOM_OUT', interval: 1.1 })
    }
  }, [dispatch])

  return (
    <g 
      transform={`scale(${zoom})`} 
      className="graph-zoom-container zoomable" 
      onWheel={editMode && scrollToZoom ? onWheel : noop}>
      {children}
    </g>
  )
}

Zoomable.propTypes = {
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}
