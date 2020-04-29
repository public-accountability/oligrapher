import React from 'react'
import { useDispatch } from 'react-redux'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

export default function ZoomControl() {
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({ type: 'ZOOM_IN' })
  const zoomOut = () => dispatch({ type: 'ZOOM_OUT' })

  return (
    <div id="oligrapher-zoomcontrol">
      <div>
        <button onClick={zoomIn}><AiOutlinePlus /></button>
        <button onClick={zoomOut}><AiOutlineMinus /></button>
      </div>
    </div>
  )
}