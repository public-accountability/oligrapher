import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from './Svg'
import Markers from './Markers'
import Filters from './Filters'
import Pannable from './Pannable'
import Zoomable from './Zoomable'
import Selectable from './Selectable'
import Highlightable from './Highlightable'
import calculateAnnotationViewBox from '../util/calculateAnnotationViewBox'
import { State, SvgSizeType } from '../util/defaultState'

export const GRAPH_CONTAINER_ID = 'oligrapher-graph-svg'
export const GRAPH_CONTENT_ID = 'oligrapher-svg-export'

/*
  The core component that displays the graph
*/
export function Graph() {
  const viewBox = useSelector(calculateAnnotationViewBox)
  const storyMode = useSelector<State>(state => state.display.modes.story)
  const zoom = useSelector<State>(state => state.display.zoom)
  // const draggedNode = useSelector<State>(state => state.display.draggedNode)
  const { width, height } = useSelector<State, SvgSizeType>(state => state.display.svgSize)

  const svgRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    let width = svgRef.current.getBoundingClientRect().width
    dispatch({ type: 'SET_SVG_WIDTH', width })
  }, [svgRef, dispatch, storyMode])

  // const className = draggedNode ? "oligrapher-graph-dragging-node" : ""
  const className = ""

  return  <div id={GRAPH_CONTAINER_ID} className={className} style={{ height: height + "px" }}>
            <Svg outermost={true} viewBox={viewBox} height={height + "px"} ref={svgRef}>
              <defs>
                <Filters />
                <Markers />
              </defs>
              <Zoomable zoom={zoom}>
                <Pannable>
                  <Highlightable>
                    <g id={GRAPH_CONTENT_ID}>
                      <Edges />
                      <Nodes />
                      <Captions />
                    </g>
                  </Highlightable>
                </Pannable>
              </Zoomable>
            </Svg>
          </div>
}

export default Graph
