import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../util/defaultState'
import { currentZoomSelector } from '../util/selectors'

export default function Zoomable(props: { children: React.ReactNode}) {
  const zoom = useSelector(currentZoomSelector)
  const transform = `scale(${zoom})`

  return <g id="oligrapher-zoom-container" transform={transform} className="graph-zoom-container">
    {props.children}
  </g>

}
