import React, { useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"

import { xy, Point } from "../util/geometry"
import {
  svgCoordinatesFromMouseEvent,
  svgRectToViewbox,
  SVG_ID,
  viewBoxToString,
} from "../util/dimensions"

import {
  allowCreateNewCaptionSelector,
  currentViewboxSelector,
  currentZoomSelector,
  pannableSelector,
  scrollToZoomSelector,
  svgHeightSelector,
  svgScaleSelector,
} from "../util/selectors"
import SvgRefContext from "../util/SvgRefContext"

const pointFromEvent = (event: React.MouseEvent, svg: SVGSVGElement, zoom: number): Point => {
  // once this bug is resolved https://bugzilla.mozilla.org/show_bug.cgi?id=1610093
  // I suspect that .scale(zoom) can be removed
  const matrix = svg.getScreenCTM().scale(zoom).inverse()
  const p = new DOMPoint(event.clientX, event.clientY)
  return xy(p.matrixTransform(matrix))
}

export default function Svg(props: { children: React.ReactNode }) {
  const svgRef = useContext(SvgRefContext)
  const dispatch = useDispatch()
  const viewBox = useSelector(currentViewboxSelector)
  const pannable = useSelector(pannableSelector)
  const allowCreateNewCaption = useSelector(allowCreateNewCaptionSelector)
  const scrollToZoom = useSelector(scrollToZoomSelector)
  const svgHeight = useSelector(svgHeightSelector)
  const zoom = useSelector(currentZoomSelector)
  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 })

  const svgAttrs: React.SVGProps<SVGSVGElement> = {
    height: "100%",
    width: "100%",
    preserveAspectRatio: "xMidYMid",
    viewBox: viewBoxToString(viewBox),
    xmlns: "http://www.w3.org/2000/svg",
    id: SVG_ID,
  }

  const divAttrs: React.HTMLProps<HTMLDivElement> = {
    style: { height: svgHeight - 10, width: "100%", overflow: "hidden" },
  }

  if (scrollToZoom) {
    divAttrs.onWheel = event => {
      event.preventDefault()
      dispatch({ type: "SET_ZOOM_FROM_SCROLL", deltaY: event.deltaY })
    }
  }

  if (pointerDown) {
    divAttrs.style.cursor = "grabbing"
  }

  if (allowCreateNewCaption) {
    divAttrs.style.cursor = "crosshair"
  }

  divAttrs.onClick = event => {
    dispatch({ type: "CLICK_BACKGROUND", point: pointFromEvent(event, svgRef.current, zoom) })
  }

  // Panning
  // try using stopPropagation() if other oligrapher events bubble up
  if (pannable) {
    divAttrs.onMouseDown = event => {
      event.preventDefault()
      setPointerDown(true)
      setStartPosition(pointFromEvent(event, svgRef.current, zoom))
    }

    divAttrs.onMouseUp = event => {
      event.preventDefault()
      setPointerDown(false)
      dispatch({ type: "SET_VIEWBOX", viewBox: svgRectToViewbox(svgRef.current.viewBox.baseVal) })
    }

    // https://css-tricks.com/creating-a-panning-effect-for-svg/
    divAttrs.onMouseMove = event => {
      if (!pointerDown) {
        return
      }

      event.preventDefault()
      const currentPosition = pointFromEvent(event, svgRef.current, zoom)
      const diffX = currentPosition.x - startPosition.x
      const diffY = currentPosition.y - startPosition.y
      svgRef.current.viewBox.baseVal.x -= diffX
      svgRef.current.viewBox.baseVal.y -= diffY
    }

    divAttrs.onMouseLeave = event => {
      event.preventDefault()
      setPointerDown(false)
      dispatch({ type: "SET_VIEWBOX", viewBox: svgRectToViewbox(svgRef.current.viewBox.baseVal) })
    }
  }

  return (
    <div {...divAttrs} id="oligrapher-graph-svg">
      <svg ref={svgRef} {...svgAttrs}>
        {props.children}
      </svg>
    </div>
  )
}
