import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
export function Graph({ viewBox, zoom, svgSize, setSvgSize }) {
  const headerHeight = 190 // set in css

  // used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)

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

    // run on first render or when undo takes us back to 
    // the initial state where there's no svgSize
    if (!svgSize) {
      handleWindowResize()
    }

    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [svgSize]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="oligrapher-graph-svg">
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

Graph.propTypes = {
  viewBox: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  svgSize: PropTypes.object,
  setSvgSize: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const { viewBox, zoom, svgSize } = state.display
  const { nodes } = state.graph

  return {
    viewBox, zoom, svgSize, nodes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSvgSize: size => dispatch({ type: 'SET_SVG_SIZE', size })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)