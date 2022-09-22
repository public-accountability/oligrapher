import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Viewbox } from '../graph/graph'
import { Point } from '../util/geometry'
import { stringToViewBox, SVG_ID, viewBoxToString } from '../util/dimensions'
import { useDispatch, useSelector } from 'react-redux'
import { currentViewboxSelector, currentZoomSelector, pannableSelector, svgUISelector } from '../util/selectors'
import calculateAnnotationViewBox from '../util/calculateAnnotationViewBox'

const pointFromEvent = (event: React.MouseEvent): Point => ({ x: event.clientX, y: event.clientY })

export default function Svg(props) {
  const dispatch = useDispatch()
  const viewBox = useSelector(currentViewboxSelector)
  const pannable = useSelector(pannableSelector)

  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0})
  const [viewBoxString, setViewBoxString] = useState<string>(viewBoxToString(viewBox))

  const attributes: React.SVGAttributes<SVGSVGElement> = {
    height: props.height,
    width: props.width,
    viewBox: viewBoxString,
    preserveAspectRatio: 'xMidYMid',
    xmlns: "http://www.w3.org/2000/svg" ,
    id: SVG_ID
  }

  // Panning
  // try using stopPropagation() if other oligrapher events bubble up
  if (pannable) {
    attributes.onMouseDown = (event) => {
      setPointerDown(true)
      setStartPosition(pointFromEvent(event))
    }

    attributes.onMouseUp = () => {
      setPointerDown(false)
    }

    attributes.onMouseMove = (event) => {
      // event.preventDefault()
      if (!pointerDown) { return }

      const currentPosition = pointFromEvent(event)

      const newViewBox: Viewbox = {
        minX: viewBox.minX - (currentPosition.x - startPosition.x),
        minY: viewBox.minY - (currentPosition.y - startPosition.y),
        w: viewBox.w,
        h: viewBox.h
      }
      setViewBoxString(viewBoxToString(newViewBox))
    }

    attributes.onMouseLeave = () => {
      setPointerDown(false)
      dispatch({ type: 'SET_VIEWBOX', viewBox: stringToViewBox(viewBoxString) })
    }
  }

  return <svg {...attributes}>{props.children}</svg>
}
