import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { FaBezierCurve } from 'react-icons/fa'

import Toolbox from './Toolbox'

export default function OrganizeTool() {
  const dispatch = useDispatch()
  const forceDirectedLayout = useCallback(() => dispatch({ type: 'FORCE_LAYOUT_REQUESTED' }), [dispatch])

  return (
    <Toolbox title="Organize Map">
      <div className="organize-map">
        <a title="Force-directed" onClick={forceDirectedLayout}><FaBezierCurve /></a>
      </div>
    </Toolbox>
  )
}