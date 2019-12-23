import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export default function ZoomControl(props) {
  const zoom = useSelector(state => state.graph.zoom)
  const dispatch = useDispatch()
  const zoomIn = () => dispatch({type: 'ZOOM', direction: 'IN'})
  const zoomOut = () => dispatch({type: 'ZOOM', direction: 'OUT'})

  return <div className="oligrapher-zoomcontrol">
           <div>
             <button>+</button>
             <button>-</button>
           </div>
         </div>
}
