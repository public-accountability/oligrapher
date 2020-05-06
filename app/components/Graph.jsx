import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

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
export function Graph({ viewBox, zoom, svgSize, headerIsCollapsed, setSvgSize }) {
  // used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)
  const [svgHeight, setSvgHeight] = useState(500)

  const handleResize = () => {
    const windowHeight = window.innerHeight
    const headerHeight = headerIsCollapsed ? 52 : 182
    const svgHeight = Math.floor(windowHeight - headerHeight - 10)
    const { width } = svgRef.current.getBoundingClientRect()
    setSvgSize({ width: Math.floor(width), height: svgHeight })
    setSvgHeight(svgHeight)
  }

  useEffect(handleResize, [headerIsCollapsed])
  
  return (
    <div id="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height={svgHeight + "px"} ref={svgRef}>
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable>
            {/* don't show graph until svgSize has been set */}
            { svgSize ? (
              <>
                <Edges />
                <Nodes />
                <Captions />
              </>
            ) : <></> }
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
  headerIsCollapsed: PropTypes.bool.isRequired,
  setSvgSize: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const { viewBox, zoom, svgSize, headerIsCollapsed } = state.display
  const { nodes } = state.graph

  return {
    viewBox, zoom, svgSize, headerIsCollapsed, nodes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSvgSize: size => dispatch({ type: 'SET_SVG_SIZE', size })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)