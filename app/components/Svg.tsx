import React, { useEffect, useLayoutEffect, useRef, useState, useContext } from "react"
import { xy, Point } from "../util/geometry"
import { svgRectToViewbox, SVG_ID, viewBoxToString } from "../util/dimensions"
import { useDispatch, useSelector } from "react-redux"
import {
  currentViewboxSelector,
  pannableSelector,
  scrollToZoomSelector,
  svgHeightSelector,
} from "../util/selectors"
import SvgRefContext from "../util/SvgRefContext"

//const pointFromEvent = (event: React.MouseEvent): Point => ({ x: event.clientX, y: event.clientY })

const pointFromEvent = (event: React.MouseEvent, svg: SVGSVGElement): Point => {
  const invertedSVGMatrix = svg.getScreenCTM().inverse()
  return xy(
    DOMPoint.fromPoint({ x: event.clientX, y: event.clientY }).matrixTransform(invertedSVGMatrix)
  )
}

export default function Svg(props: { children: React.ReactNode }) {
  // const svgRef = useRef(null)
  const svgRef = useContext(SvgRefContext)
  const dispatch = useDispatch()
  const viewBox = useSelector(currentViewboxSelector)
  const pannable = useSelector(pannableSelector)
  const scrollToZoom = useSelector(scrollToZoomSelector)
  const svgHeight = useSelector(svgHeightSelector)
  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0 })

  const svgAttrs: React.SVGProps<SVGSVGElement> = {
    height: svgHeight,
    width: "100%",
    viewBox: viewBoxToString(viewBox),
    preserveAspectRatio: "xMidYMid",
    xmlns: "http://www.w3.org/2000/svg",
    id: SVG_ID,
  }

  const divAttrs: React.HTMLProps<HTMLDivElement> = {
    style: { height: "100%", width: "100%" },
  }

  if (scrollToZoom) {
    divAttrs.onWheel = event => {
      event.preventDefault()
      dispatch({ type: "SET_ZOOM_FROM_SCROLL", deltaY: event.deltaY })
    }
  }

  // Panning
  // try using stopPropagation() if other oligrapher events bubble up
  if (pannable) {
    divAttrs.onMouseDown = event => {
      event.preventDefault()
      setPointerDown(true)
      setStartPosition(pointFromEvent(event, svgRef.current))
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
      const currentPosition = pointFromEvent(event, svgRef.current)
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

  if (pointerDown) {
    divAttrs.style = { cursor: "grabbing" }
  }

  return (
    <div {...divAttrs} id="oligrapher-graph-svg">
      <svg ref={svgRef} {...svgAttrs}>
        {props.children}
      </svg>
    </div>
  )
}
