import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Viewbox } from '../graph/graph'
import { Point } from '../util/geometry'
import { SVG_ID, viewBoxToString } from '../util/dimensions'
import { useDispatch, useSelector } from 'react-redux'
import { currentZoomSelector, svgUISelector } from '../util/selectors'
import { clamp } from 'lodash'
import calculateAnnotationViewBox from '../util/calculateAnnotationViewBox'

type SvgPropTypes = {
  viewBox: Viewbox,
  height: number,
  width: number,
  preserveAspectRatio?: string,
  outermost: boolean | null | undefined,
  children: React.ReactNode
}

const pointFromEvent = (event: React.MouseEvent): Point => ({ x: event.clientX, y: event.clientY })

// https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
const zoomFromEvent = (zoom: number, event: React.WheelEvent): number => {
  event.preventDefault()
  let scale = zoom + (event.deltaY * -0.01);
  return clamp(scale, 0.25, 10)
}

export default function Svg(props: SvgPropTypes) {
  const dispatch = useDispatch()
  const viewBox = useSelector(calculateAnnotationViewBox)
  const zoom = useSelector(currentZoomSelector)
  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0})
  const [viewBoxString, setViewBoxString] = useState<string>(viewBoxToString(viewBox))
  const svgUI = useSelector(svgUISelector)
  const ref = useRef(null) // <SVGSVGElement()

  // useLayoutEffect(() => {
  //   let { width, height } = ref.current.getBoundingClientRect()
  //   dispatch({ type: 'SET_SVG_WIDTH', width })
  //   dispatch({ type: 'SET_SVG_HEIGHT', height })
  // }, [svgUI.pannable, svgUI.storyMode, svgUI.showHeader])

  const attributes: React.SVGAttributes<SVGSVGElement> = {
    height: props.height,
    width: props.width,
    viewBox: viewBoxString,
    preserveAspectRatio: props.preserveAspectRatio ? props.preserveAspectRatio : 'xMidYMid',
    xmlns: props.outermost ? "http://www.w3.org/2000/svg" : undefined,
    id: props.outermost ? SVG_ID : undefined
  }

  if(svgUI.scrollToZoom) {
    attributes.onWheel = (event) => {
      dispatch({ type: 'SET_ZOOM', zoom: zoomFromEvent(zoom, event) })
    }
  }

  // Panning
  // try using stopPropagation() if other oligrapher events bubble up
  if (svgUI.pannable) {
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
        minX: props.viewBox.minX - (currentPosition.x - startPosition.x),
        minY: props.viewBox.minY - (currentPosition.y - startPosition.y),
        w: props.viewBox.w,
        h: props.viewBox.h
      }

      setViewBoxString(viewBoxToString(newViewBox))
    }

    attributes.onMouseLeave = () => {
      setPointerDown(false)
    }
  }

  return <svg ref={ref} {...attributes}>{props.children}</svg>
}
