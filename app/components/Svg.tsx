import React, { MouseEventHandler, useState } from 'react'
import { Viewbox } from '../graph/graph'
import { Point } from '../util/geometry'
import { SVG_ID, viewBoxToString } from '../util/dimensions'

// A thin abstraction over a regular dom <svg> element

type SvgPropTypes = {
  viewBox: Viewbox,
  height: string,
  width: string,
  preserveAspectRatio?: string, //
  outermost: boolean | null | undefined,
  children: React.ReactNode
}

const pointFromEvent = (event): Point => ({ x: event.clientX, y: event.clientY })

const Svg = React.forwardRef((props: SvgPropTypes, ref) => {
  const [pointerDown, setPointerDown] = useState(false)
  const [startPosition, setStartPosition] = useState<Point | null>(null)
  const [viewBoxString, setViewBoxString] = useState<string>(viewBoxToString(props.viewBox))

  // try using stopPropagation() if other oligrapher events bubble up

  const onMouseDown: MouseEventHandler = (event) => {
    setPointerDown(true)
    setStartPosition(pointFromEvent(event))
  }

  const onMouseUp: MouseEventHandler = (event) => {
    setPointerDown(false)
  }

  const onMouseMove: MouseEventHandler = (event) => {
    if (!pointerDown) { return }

    // event.preventDefault()

    const currentPosition = pointFromEvent(event)

    const newViewBox: Viewbox = {
      minX: props.viewBox.minX - (currentPosition.x - startPosition.x),
      minY: props.viewBox.minY - (currentPosition.y - startPosition.y),
      w: props.viewBox.w,
      h: props.viewBox.h
    }


    setViewBoxString(viewBoxToString(newViewBox))
  }

  const onMouseLeave: MouseEventHandler = (event) => {
    console.debug("so long mouse")
  }

  return <svg ref={ref}
              height={props.height}
              width={props.width}
              preserveAspectRatio={props.preserveAspectRatio ? props.preserveAspectRatio : 'xMidYMid'}
              xmlns={props.outermost ? "http://www.w3.org/2000/svg" : undefined}
              id={props.outermost ? SVG_ID : undefined }
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
              viewBox={viewBoxString}>
           {props.children}
         </svg>
})

export default Svg
