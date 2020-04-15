import React from 'react'
import { useDispatch } from 'react-redux'

export default function ZoomControl() {
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({ type: 'ZOOM', direction: 'IN' })
  const zoomOut = () => dispatch({ type: 'ZOOM', direction: 'OUT' })

  return (
    <div className="oligrapher-zoomcontrol">
      <div>
        <button onClick={zoomIn}>+</button>
        <button onClick={zoomOut}>-</button>
      </div>
    </div>
  )
}