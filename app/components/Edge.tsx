import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { DraggableCore } from 'react-draggable'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import { Point, calculateDeltas } from '../util/geometry'
import { Curve, edgeToCurve, curveToBezier } from '../graph/curve'
import EdgeLine from './EdgeLine'
import EdgeHandle from './EdgeHandle'
import EdgeLabel from './EdgeLabel'

export function Edge({ id, currentlyEdited }: EdgeProps) {
  const dispatch = useDispatch()
  const edge = useSelector(state => state.graph.edges[id])
  const actualZoom = useSelector(state => state.display.actualZoom)

  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState<Point>({ x: 0, y: 0 })
  const { cx, cy, x1, x2, y1, y2, s1, s2, scale, label, dash, status, arrow } = edge
  const [curve, setCurve] = useState(edgeToCurve({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 })
  const bezier = useMemo(() => curveToBezier(curve), [curve])

  const updateEdge = useCallback(
    attributes => dispatch({ type: 'UPDATE_EDGE', id, attributes }), 
    [dispatch, id]
  )
  const clickEdge = useCallback(
    () => dispatch({ type: 'CLICK_EDGE', id }), 
    [dispatch, id]
  )

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => {  
    setCurve(edgeToCurve({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  }, [cx, cy, x1, x2, y1, y2, s1, s2, id])

  const onStart = useCallback((evt, data) => {
    setStartDrag(data)
    // edge may not have a set control point
    setStartPosition({ x: cx || curve.cx, y: cy || curve.cy })
  }, [cx, cy, curve])

  const onDrag = useCallback((evt, data) => {
    setDragging(true)
    const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
    setCurve(
      edgeToCurve({...edge, cx: deltas.x, cy: deltas.y })
    )
  }, [startPosition, startDrag, actualZoom, edge])

  const onStop = useCallback((evt, data) => {
    if (isDragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
      updateEdge({ cx: deltas.x, cy: deltas.y })
      setDragging(false)
    } else {
      clickEdge()
    }
  }, [isDragging, startPosition, startDrag, actualZoom, clickEdge, updateEdge])

  // Children Props
  const width = 2 + (scale -1) * 3
  const edgeLineProps = { bezier, width, isReverse: curve.is_reverse, id, scale, dash, status, arrow }
  const edgeLabelProps = { bezier, width, id, scale, status, arrow, label }
  const edgeHandleProps = { 
    bezier, width,
    onMouseEnter: useCallback(() => setHovering(true), []),
    onMouseLeave: useCallback(() => setHovering(false), [])
  }

  // Display helpers
  const showHighlight = !isDragging && (currentlyEdited || isHovering)
  const showLabel = Boolean(label)
  edgeLineProps.status = showHighlight ? "highlighted" : edgeLineProps.status

  return (  
    <DraggableCore
      handle=".edge-handle"
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}>
      <g className="oligrapher-edge" id={`edge-${id}`}>
        <EdgeLine {...edgeLineProps} />
        { showLabel && <EdgeLabel {...edgeLabelProps} /> }
        <EdgeHandle {...edgeHandleProps} />
      </g>
    </DraggableCore>
  )
}

interface EdgeProps {
  id: string,
  currentlyEdited: boolean
}

export default React.memo(Edge)