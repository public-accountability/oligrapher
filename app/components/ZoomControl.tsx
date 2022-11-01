import React from "react"
import { useDispatch } from "react-redux"
import { FiMinus, FiPlus } from "react-icons/fi"
import { IoMdLocate } from "react-icons/io"

export default function ZoomControl() {
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({ type: "ZOOM_IN" })
  const zoomOut = () => dispatch({ type: "ZOOM_OUT" })
  const resetView = () => dispatch({ type: "RESET_VIEW" })

  return (
    <div id="oligrapher-zoomcontrol">
      <button title="Zoom in" onClick={zoomIn}>
        <FiPlus />
      </button>
      <button title="Zoom out" onClick={zoomOut}>
        <FiMinus />
      </button>
      <button title="Recenter" onClick={resetView}>
        <IoMdLocate />
      </button>
    </div>
  )
}
