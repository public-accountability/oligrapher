import React from 'react'
import { useDispatch } from 'react-redux'
import { FiMinus, FiPlus } from 'react-icons/fi'

export default function ZoomControl() {
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({ type: 'ZOOM_IN' })
  const zoomOut = () => dispatch({ type: 'ZOOM_OUT' })

  return (
    <div id="oligrapher-zoomcontrol">
      <div>
        <button onClick={zoomIn}><FiPlus /></button>
        <button onClick={zoomOut}><FiMinus /></button>
      </div>
    </div>
  )
}