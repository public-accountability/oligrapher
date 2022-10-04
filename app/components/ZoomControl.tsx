import React from 'react'
import { useDispatch } from 'react-redux'
import { FiMinus } from '@react-icons/all-files/fi/FiMinus'
import { FiPlus } from '@react-icons/all-files/fi/FiPlus'
import { IoMdLocate } from '@react-icons/all-files/io/IoMdLocate'

export default function ZoomControl() {
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({ type: 'ZOOM_IN' })
  const zoomOut = () => dispatch({ type: 'ZOOM_OUT' })
  const resetView = () => dispatch({ type: 'RESET_VIEW' })

  return (
    <div id="oligrapher-zoomcontrol">
      <button title="Zoom in" onClick={zoomIn}><FiPlus /></button>
      <button title="Zoom out" onClick={zoomOut}><FiMinus /></button>
      <button title="Recenter" onClick={resetView}><IoMdLocate /></button>
    </div>
  )
}
