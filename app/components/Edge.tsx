import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { DraggableCore, DraggableEventHandler } from 'react-draggable'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import { Point, calculateDeltas } from '../util/geometry'
import { getEdgeAppearance } from '../util/edgeAppearance'
import { edgeToCurve, curveToBezier } from '../graph/curve'
import { EdgeStatusType, Edge as EdgeType } from '../graph/edge'
import EdgeLine from './EdgeLine'
import EdgeHandle from './EdgeHandle'
import EdgeLabel from './EdgeLabel'
import EdgeHighlight from './EdgeHighlight'
import ConditionalLink from './ConditionalLink'
import { State } from '../util/defaultState'
import { currentZoomSelector, editModeSelector } from '../util/selectors'
import SvgRefContext from '../util/SvgRefContext'
import { ControlPoint } from './ControlPoint'

type EdgeProps = {
  id: string,
  currentlyEdited: boolean
}

function getActualZoom(svg: SVGSVGElement, zoom: number): number {
  return (svg.clientHeight / svg.viewBox.baseVal.height) * zoom
}

export function Edge({ id, currentlyEdited }: EdgeProps) {
  const dispatch = useDispatch()
  const svgRef = useContext(SvgRefContext)

  const edge = useSelector<State, EdgeType>(state => state.graph.edges[id])
  const { scale, label, dash, arrow, url } = edge

  const zoom = useSelector(currentZoomSelector)
  const isHighlighting  = useSelector<State>(state => state.annotations.isHighlighting)
  const editMode = useSelector(editModeSelector)
  const edgeStatus = useSelector<State, EdgeStatusType>(state => getEdgeAppearance(id, state))
  const showControlpoint = useSelector<State>(state => state.attributes.settings.showControlpoint)

  const [isHovering, setHovering] = useState(false)
  const [isDragging, setDragging] = useState(false)
  const [startDrag, setStartDrag] = useState<Point>({ x: 0, y: 0 })
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 })
  const [actualZoom, setActualZoom] = useState(1)
  const [curve, setCurve] = useState(edgeToCurve(edge))
  const bezier = curveToBezier(curve)
  const selected = !isDragging && (currentlyEdited || isHovering)
  const status = selected ? 'selected' : edgeStatus
  const highlighted = status === 'highlighted'

  const updateEdge = useCallback(
    attributes => dispatch({ type: 'UPDATE_EDGE', id, attributes }),
    [dispatch, id]
  )

  const clickEdge = useCallback(() => {
    if (isHighlighting) {
      dispatch({ type: 'SWAP_EDGE_HIGHLIGHT', id })
    } else {
      dispatch({ type: 'CLICK_EDGE', id })
    }
  }, [dispatch, id, isHighlighting])

  // This resets the curve based on new props when they are passed to an already rendered component
  // This happens after the DRAG_NODE action occurs.
  useEffect(() => {
    setCurve(edgeToCurve(edge))
  }, [edge])

  useEffect(()=> {
    setActualZoom(getActualZoom(svgRef.current, zoom))
  }, [])

  const onStart: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()
    setStartDrag(data)
    setActualZoom(getActualZoom(svgRef.current, zoom))
    const controlpoint = { "x": curve.cx, "y": curve.cy }
    setStartPosition(controlpoint)
  }


//   const deltaX = (draggableData.x - startDrag.x)
//   const deltaY = (draggableData.y - startDrag.y)
//   const x = deltaX + startPosition.x
//   const y = deltaY + startPosition.y
//   return { x, y }


  const onDrag: DraggableEventHandler = (evt, data) => {
    setDragging(true)
    const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
    const newControlpoint = { cx: deltas.x, cy: deltas.y }
    const newCurve = edgeToCurve(Object.assign({}, edge, newControlpoint))
    setCurve(newCurve)
  }

  const onStop: DraggableEventHandler = (evt, data) => {
    evt.stopPropagation()
    if (isDragging) {
      const deltas = calculateDeltas(data, startPosition, startDrag, actualZoom)
      console.log("Deltas-onStop", deltas)
      updateEdge({ cx: deltas.x, cy: deltas.y })
      setDragging(false)
    } else {
      clickEdge()
    }
  }

  // Children Props
  const width = 1.5 + (edge.scale -1) * 3
  const edgeHighlightProps = { bezier, width }
  const edgeLineProps = { bezier, width, isReverse: curve.is_reverse, id, scale, dash, status, arrow }
  const edgeLabelProps = { bezier, width, id, scale, status, arrow, label }
  const edgeHandleProps = { bezier, width, onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false)
  }

  return (
    <DraggableCore
      handle=".edge-handle"
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}>
      <g className="oligrapher-edge" id={`edge-${id}`}>
        <ConditionalLink condition={!editMode} url={url}>
          { highlighted && <EdgeHighlight {...edgeHighlightProps} /> }
          <EdgeLine {...edgeLineProps} />
          { label &&
            <ConditionalLink condition={editMode} url={url}>
              <EdgeLabel {...edgeLabelProps} />
            </ConditionalLink>
          }
          <EdgeHandle {...edgeHandleProps} />
        </ConditionalLink>
        { showControlpoint && (isDragging || isHovering) && <ControlPoint zoom={zoom} cx={curve.cx} cy={curve.cy} /> }
      </g>
    </DraggableCore>
  )
}

export default Edge
// export default React.memo(Edge)
