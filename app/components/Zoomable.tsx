import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from '../util/defaultState'

export default function Zoomable(props: { children: React.ReactNode}) {

  const dispatch = useDispatch()

  const editMode = useSelector<State>(state => state.display.modes.editor)
  const zoom = useSelector<State>(state => state.display.zoom)

  const transform = `scale(${zoom})`

  return <g id="oligrapher-zoom-container" transform={transform} className="graph-zoom-container zoomable">
    {props.children}
  </g>

}


// onWheel={editMode && scrollToZoom ? ({ deltaY }) => onWheel(deltaY) : noop}>
