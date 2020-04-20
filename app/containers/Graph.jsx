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
export function Graph({ viewBox, zoom, actualZoom, setSvgSize }) {
  // The two dom references are used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  // we want to keep track of svg size to compute actual zoom
  useEffect(() => {
    const handleWindowResize = function() {
      const { width, height } = svgRef.current.getBoundingClientRect()
      setSvgSize({ width, height })
    }

    handleWindowResize() // run on first render
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height="500px "width="100%" ref={svgRef}>
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable scale={zoom * actualZoom}>
            <Clickable>
              <Nodes />
              <Edges />
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
  actualZoom: PropTypes.number
}

const mapStateToProps = function(state) {
  return {
    viewBox: state.display.viewBox,
    zoom: state.display.zoom,
    actualZoom: state.display.actualZoom
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    setSvgSize: (size) => dispatch({ type: 'SET_SVG_SIZE', size })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
