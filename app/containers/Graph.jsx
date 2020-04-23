import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Clickable from './Clickable'
import Svg from '../components/graph/Svg'
import Markers from '../components/graph/Markers'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'

/*
  The core component that displays the graph
*/
export function Graph({ viewBox, zoom, actualZoom, setSvgSize, headerHeight }) {
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

    handleWindowResize() // run on first render
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [headerHeight, setSvgSize]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height="500px" width="100%" ref={svgRef}>
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable scale={actualZoom / zoom}>
            <Clickable>
              <Edges />
              <Nodes />
              <Captions />
            </Clickable>
          </Pannable>
        </Zoomable>
      </Svg>
    </div>
  )
}

Graph.propTypes = {
  viewBox: PropTypes.object.isRequired,
  setSvgSize: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  headerHeight: PropTypes.number.isRequired,
  actualZoom: PropTypes.number
}

const mapStateToProps = function(state) {
  return {
    viewBox: state.display.viewBox,
    zoom: state.display.zoom,
    actualZoom: state.display.actualZoom,
    headerHeight: state.display.headerHeight
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    setSvgSize: (size) => dispatch({ type: 'SET_SVG_SIZE', size })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
