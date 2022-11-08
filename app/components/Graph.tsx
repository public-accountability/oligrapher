import React from "react"

import Edges from "./Edges"
import Nodes from "./Nodes"
import Captions from "./Captions"
import Svg from "./Svg"
import Markers from "./Markers"
import Filters from "./Filters"
import Zoomable from "./Zoomable"

export const GRAPH_CONTENT_ID = "oligrapher-svg-export"

// The core component that displays the graph
//   <Svg>
//     <defs>
//     <Zoomable>
//       <g id="oligrapher-svg-export">
//         <Edges>
//         <Nodes>
//         <Captions>
export default function Graph() {
  return (
    <Svg>
      <defs>
        <Filters />
        <Markers />
      </defs>
      <Zoomable>
        <g id={GRAPH_CONTENT_ID}>
          <Edges />
          <Nodes />
          <Captions />
        </g>
      </Zoomable>
    </Svg>
  )
}
