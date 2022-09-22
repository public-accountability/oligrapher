import React from 'react'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from './Svg'
import Markers from './Markers'
import Filters from './Filters'
import Zoomable from './Zoomable'
import Selectable from './Selectable'
import Highlightable from './Highlightable'
import calculateAnnotationViewBox from '../util/calculateAnnotationViewBox'
import { State, SvgSizeType } from '../util/defaultState'

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
  const ref = React.useRef<HTMLDivElement>(null)
  // const [size, setSize] = React.useState<SvgSizeType|null>(null)
  // const height = size ? size.height : 800
  // const width = size ? size.width : 600

  const height = '100%'
  const width = '100%'

  // React.useLayoutEffect(() => {
  //   if (ref.current) {
  //     const rect = ref.current.getBoundingClientRect()
  //     setSize({ height: rect.height, width: rect.width })
  //   }
  // }, [ref])

  return (
    <div ref={ref} id={GRAPH_CONTAINER_ID}>
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
