import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import noop from 'lodash/noop'
import clamp from 'lodash/clamp'

let timeout

export default function Zoomable({ zoom, children }) {
  const dispatch = useDispatch()
  const { scrollToZoom } = useSelector(state => state.attributes.settings)
  const editMode = useSelector(state => state.display.modes.editor)
  const [scroll, setScroll] = useState(0)

  const scrolledZoom = (zoom, scroll) => zoom * (1 - scroll / 1000)

  const onWheel = deltaY => {
    setScroll(clamp(scroll + deltaY, -2000, 800))

    // after scrolling stops, update zoom and reset scroll
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      dispatch({ type: 'SET_ZOOM', zoom: scrolledZoom(zoom, scroll) })
      setScroll(0)
    }, 1000)
  }

  useEffect(() => {
    return () => clearTimeout(timeout)
  }, [zoom])

  return <>{children}</>

  // return (
  //   <g
  //     id="oligrapher-zoom-container"
  //     transform={`scale(${scrolledZoom(zoom, scroll)})`}
  //     className="graph-zoom-container zoomable"
  //     onWheel={editMode && scrollToZoom ? ({ deltaY }) => onWheel(deltaY) : noop}>
  //     {children}
  //   </g>
  // )
}

Zoomable.propTypes = {
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}
