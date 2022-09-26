import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { xy, Point } from '../util/geometry'
import { svgRectToViewbox, SVG_ID, viewBoxToString } from '../util/dimensions'
import { useDispatch, useSelector } from 'react-redux'
import { currentViewboxSelector, currentZoomSelector, pannableSelector, svgUISelector } from '../util/selectors'
import Zoomable from './Zoomable'

//const pointFromEvent = (event: React.MouseEvent): Point => ({ x: event.clientX, y: event.clientY })

const pointFromEvent = (event: React.MouseEvent, svg: SVGSVGElement): Point => {
  const invertedSVGMatrix = svg.getScreenCTM().inverse()
  return xy(DOMPoint.fromPoint({ x: event.clientX, y: event.clientY }).matrixTransform(invertedSVGMatrix))
}

export default function Svg(props) {
  const svgRef = useRef(null)
  const dispatch = useDispatch()
  const viewBox = useSelector(currentViewboxSelector)
  const pannable = useSelector(pannableSelector)
  const zoom = useSelector(currentZoomSelector)
  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point>({ x: 0, y: 0})
  // const [scale, setScale] = useState(1)

  const svgAttrs: React.SVGProps<SVGSVGElement> = {
    height: props.height,
    width: props.width,
    viewBox: viewBoxToString(viewBox),
    preserveAspectRatio: 'xMidYMid',
    xmlns: "http://www.w3.org/2000/svg" ,
    id: SVG_ID
  }

  const divAttrs: React.HTMLProps<HTMLDivElement> = {
    height: props.height,
    width: props.width
  }

  // Panning
  // try using stopPropagation() if other oligrapher events bubble up
  if (pannable) {
    divAttrs.onMouseDown = (event) => {
      event.preventDefault()
      setPointerDown(true)
      setStartPosition(pointFromEvent(event, svgRef.current))
      // setScale(ref.current.getBoundingClientRect().width / ref.current.viewBox.baseVal.width)
    }

    divAttrs.onMouseUp = (event) => {
      event.preventDefault()
      setPointerDown(false)
      dispatch({ type: 'SET_VIEWBOX', viewBox: svgRectToViewbox(svgRef.current.viewBox.baseVal) })
    }

    // https://css-tricks.com/creating-a-panning-effect-for-svg/
    divAttrs.onMouseMove = (event) => {
      if (!pointerDown) { return }
      event.preventDefault()
      const currentPosition = pointFromEvent(event, svgRef.current)
      const diffX = (currentPosition.x - startPosition.x)
      const diffY = (currentPosition.y - startPosition.y)
      svgRef.current.viewBox.baseVal.x -= diffX
      svgRef.current.viewBox.baseVal.y -= diffY
    }

    divAttrs.onMouseLeave = (event) => {
      event.preventDefault()
      setPointerDown(false)
      dispatch({ type: 'SET_VIEWBOX', viewBox: svgRectToViewbox(svgRef.current.viewBox.baseVal) })
    }
  }

  return (
    <div {...divAttrs}>
      <svg ref={svgRef} {...svgAttrs}>
        <Zoomable>
          {props.children}
        </Zoomable>
      </svg>
    </div>

  )

}
