import React, { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from '../components/graph/Svg'
import Markers from '../components/graph/Markers'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'

/*
  The core component that displays the graph
*/
export default function Graph() {
  const dispatch = useDispatch()
  const { viewBox, zoom } = useSelector(state => state.display)
  const headerHeight = 200 // set in css

  // used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)

  const setSvgSize = useCallback(
    size => dispatch({ type: 'SET_SVG_SIZE', size }), 
    [dispatch]
  )

  // set svg height to maxmimum without having to scroll
  // and keep track of svg size to compute actual zoom
  useEffect(() => {
    const handleWindowResize = function() {
      const windowHeight = window.innerHeight
      const svgHeight = Math.floor(windowHeight - headerHeight - 10)
      svgRef.current.style.height = (svgHeight) + "px"
      const { width } = svgRef.current.getBoundingClientRect()
      setSvgSize({ width: Math.floor(width), height: svgHeight })
    }

    handleWindowResize() // run on first render
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height="500px" width="100%" ref={svgRef}>
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable>
            <Edges />
            <Nodes />
            <Captions />
          </Pannable>
        </Zoomable>
      </Svg>
    </div>
  )
}