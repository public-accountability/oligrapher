import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactResizeDetector from 'react-resize-detector'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from './Svg'
import Markers from './Markers'
import Pannable from './Pannable'
import Zoomable from './Zoomable'

/*
  The core component that displays the graph
*/
export function Graph({ viewBox, zoom, setSvgSize }) {
  // used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)

  const handleResize = function() {
    const windowHeight = window.innerHeight
    const headerHeight = document.getElementById("oligrapher-header").getBoundingClientRect().height
    const svgHeight = Math.floor(windowHeight - headerHeight - 10)
    svgRef.current.style.height = (svgHeight) + "px"
    const { width } = svgRef.current.getBoundingClientRect()
    setSvgSize({ width: Math.floor(width), height: svgHeight })
  }

  return (
    <div id="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height="500px" ref={svgRef}>
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable>
            <Edges />
            <Nodes />
            <Captions />
          </Pannable>
        </Zoomable>
      </Svg>
      <ReactResizeDetector
        handleWidth
        handleHeight
        querySelector="#oligrapher-graph-svg"
        onResize={handleResize}
        skipOnMount={false} />
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