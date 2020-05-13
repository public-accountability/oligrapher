import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { useDispatch } from 'react-redux'
import pick from 'lodash/pick'

import { useSelector } from '../util/helpers'
import { calculateDeltas } from '../util/deltas'
import Curve from '../graph/curve'
import EdgeLine from './EdgeLine'
import EdgeHandle from './EdgeHandle'
import EdgeLabel from './EdgeLabel'

export function Edge({ id, currentlyEdited }) {
  const dispatch = useDispatch()
  const edge = useSelector(state => state.graph.edges[id])
  const actualZoom = useSelector(state => state.display.actualZoom)

  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState()
  const { cx, cy, x1, x2, y1, y2, s1, s2, scale, label } = edge
  const [geometry, setGeometry] = useState(Curve.calculateGeometry({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  const curve = useMemo(() => Curve.from.geometry(geometry), [geometry])

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
    setGeometry(Curve.calculateGeometry({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  }, [cx, cy, x1, x2, y1, y2, s1, s2, id])

  const pickProps = (...propNames) => pick(edge, propNames)

  const width = 1 + (scale -1) * 5
  const startPosition = useMemo(() => ({ x: cx, y: cy }), [cx, cy])

  const onStart = useCallback((evt, data) => {
    setStartDrag(data)
  }, [])

  const onDrag = useCallback((evt, data) => {
    setDragging(true)
    const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
    setGeometry(
      Curve.calculateGeometry({...edge, cx: deltas.x, cy: deltas.y })
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
  const edgeLineProps = { curve, width, isReverse: geometry.is_reverse, ...pickProps('id', 'scale', 'dash', 'status', 'arrow') }
  const edgeLabelProps = { curve, width, ...pickProps('id', 'scale', 'status', 'label') }
  const edgeHandleProps = { 
    curve, width,
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

Edge.propTypes = {
  id: PropTypes.string.isRequired,
  currentlyEdited: PropTypes.bool.isRequired
}

export default React.memo(Edge)