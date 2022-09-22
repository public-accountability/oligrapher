import React, { MouseEventHandler, useRef, WheelEventHandler } from 'react'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from './Svg'
import Markers from './Markers'
import Filters from './Filters'
import Zoomable from './Zoomable'
import Selectable from './Selectable'
import Highlightable from './Highlightable'
import { State, SvgSizeType } from '../util/defaultState'

import { useDispatch, useSelector } from 'react-redux'

export const GRAPH_CONTAINER_ID = 'oligrapher-graph-svg'
export const GRAPH_CONTENT_ID = 'oligrapher-svg-export'



// The core component that displays the graph
// <div id="oligrapher-graph">
//   <Svg>
//     <Zoomable>
//       <Highlightable>
//         <g id="oligrapher-svg-export">
//            <Edges>
//            <Nodes>
//            <Captions>
export default function Graph() {
  const dispatch = useDispatch()
  const scrollToZoom = useSelector<State, boolean>(state => state.attributes.settings.scrollToZoom)
  const ref = useRef<HTMLDivElement>(null)
  const height = '100%'
  const width = '100%'

  let onWheel: WheelEventHandler = (event) => {
    event.preventDefault()
    dispatch({ type: 'SET_ZOOM_FROM_SCROLL', deltaY: event.deltaY })
  }

  return (
    <div ref={ref} id={GRAPH_CONTAINER_ID} onWheel={scrollToZoom ? onWheel : undefined }>
      <Svg outermost={true} height={height} width={width}>
        <defs>
          <Filters />
          <Markers />
        </defs>
        <Zoomable>
          <Highlightable>
            <g id={GRAPH_CONTENT_ID}>
              <Edges />
              <Nodes />
              <Captions />
            </g>
          </Highlightable>
        </Zoomable>
      </Svg>
    </div>
  )
}


// const className = draggedNode ? "oligrapher-graph-dragging-node" : ""
  // React.useLayoutEffect(() => {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect()
  //     setSize({ height: rect.height, width: rect.width })
  //   }
  // }, [ref])
// const [size, setSize] = React.useState<SvgSizeType|null>(null)
  // const height = size ? size.height : 800
  // const width = size ? size.width : 600
