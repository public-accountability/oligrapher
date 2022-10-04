import React, { MouseEventHandler, useEffect, useRef, WheelEventHandler } from 'react'

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

// export const GRAPH_CONTAINER_ID = 'oligrapher-graph-svg'
export const GRAPH_CONTENT_ID = 'oligrapher-svg-export'

// The core component that displays the graph
//   <Svg>
//       <Highlightable>
//         <g id="oligrapher-svg-export">
//            <Edges>
//            <Nodes>
//            <Captions>
export default function Graph() {
  return (
    <Svg>
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
  )
}

// <div ref={ref} id="oligrapher-graph-svg-" onWheel={scrollToZoom ? onWheel : undefined } style={{height: '100%'}}> </div>
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
