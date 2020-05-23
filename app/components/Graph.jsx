import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from './Svg'
import Markers from './Markers'
import Filters from './Filters'
import Pannable from './Pannable'
import Zoomable from './Zoomable'

/*
  The core component that displays the graph
*/
export function Graph(props) {
  // used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)
  const [svgHeight, setSvgHeight] = useState(500)

  const {
    viewBox, zoom, svgSize, headerIsCollapsed, setSvgSize, rootContainerId 
  } = props

  const handleResize = () => {
    const containerTop = document
      .getElementById(rootContainerId)
      .getBoundingClientRect()
      .top
    const containerHeight = window.innerHeight - containerTop
    const headerHeight = headerIsCollapsed ? 52 : 148
    const svgHeight = Math.floor(containerHeight - headerHeight)
    const { width } = svgRef.current.getBoundingClientRect()
    setSvgSize({ width: Math.floor(width), height: svgHeight })
    setSvgHeight(svgHeight)
  }

  useEffect(handleResize, [headerIsCollapsed])
  
  return (
    <div id="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={viewBox} height={svgHeight + "px"} ref={svgRef}>
        <Filters />
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
  setSvgSize: PropTypes.func.isRequired,
  rootContainerId: PropTypes.string.isRequired
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