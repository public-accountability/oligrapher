import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DraggableCore } from 'react-draggable'
import { useDispatch } from 'react-redux'
import pick from 'lodash/pick'

import { useSelector } from '../util/helpers'
import { calculateDeltas } from '../util/deltas'
import Curve from '../graph/curve'
import EdgeLine from '../components/graph/EdgeLine'
import EdgeHandle from '../components/graph/EdgeHandle'
import EdgeLabel from '../components/graph/EdgeLabel'

export default function Edge({ edge, currentlyEdited }) {
  const dispatch = useDispatch()
  const actualZoom = useSelector(state => state.display.actualZoom)
  const editorMode = useSelector(state => state.display.modes.editor)

  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState()
  const [geometry, setGeometry] = useState(Curve.calculateGeometry(edge))
  const curve = Curve.from.geometry(geometry)

  const { cx, cy, x1, x2, y1, y2, s1, s2, scale, label, id } = edge

  const updateEdge = attributes => dispatch({ type: 'UPDATE_EDGE', id, attributes })
  const clickEdge = () => dispatch({ type: 'CLICK_EDGE', id })


  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => {
    setGeometry(Curve.calculateGeometry({ cx, cy, x1, x2, y1, y2, s1, s2 }))
  }, [cx, cy, x1, x2, y1, y2, s1, s2]) // eslint-disable-line react-hooks/exhaustive-deps

  const pickProps = (...propNames) => pick(edge, propNames)

  const width = 1 + (scale -1) * 5
  const startPosition = { x: cx, y: cy }

  const onStart = (evt, data) => {
    setStartDrag(data)
  }

  const onDrag = (evt, data) => {
    setDragging(true)
    const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
    setGeometry(
      Curve.calculateGeometry({...edge, cx: deltas.x, cy: deltas.y })
    )
  }

  const onStop = (evt, data) => {
    if (isDragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
      updateEdge({ cx: deltas.x, cy: deltas.y })
      setDragging(false)
    } else {
      clickEdge()
    }
  }

  // Children Props
  const edgeLineProps = { curve, width, isReverse: geometry.is_reverse, ...pickProps('id', 'scale', 'dash', 'status', 'arrow') }
  const edgeLabelProps = { curve, width, ...pickProps('id', 'scale', 'status', 'label') }
  const edgeHandleProps = { 
    curve, width,
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false)
  }

  // Display helpers
  const showHighlight = !isDragging && (currentlyEdited || isHovering)
  const showLabel = Boolean(label)
  edgeLineProps.status = showHighlight ? "highlighted" : edgeLineProps.status

  return (  
    <DraggableCore
      handle=".edge-handle"
      disabled={!editorMode}
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
  edge: PropTypes.object.isRequired,
  currentlyEdited: PropTypes.bool.isRequired
}