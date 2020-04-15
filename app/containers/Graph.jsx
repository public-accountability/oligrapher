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

import { applyZoomToViewBox, computeSvgZoom } from '../util/dimensions'

/*
  The core component that displays the graph
*/
export function Graph(props) {
  // The two dom references are used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  // calculate actual zoom = user-set zoom (props.zoom) x automatic svg zoom
  // only triggered by initial render and user zoom changes
  useEffect(() => {
    const zoomedViewBox = applyZoomToViewBox(props.viewBox, props.zoom)
    const svgZoom = computeSvgZoom(zoomedViewBox, svgRef.current)
    props.setActualZoom(props.zoom * svgZoom)
  }, [props.viewBox, props.zoom])

  return (
    <div ref={containerRef} className="oligrapher-graph-svg">
      <Svg outermost={true} viewBox={props.viewBox} height="500px "width="100%" ref={svgRef}>
        <Markers />
        <Zoomable zoom={props.zoom}>
          <Pannable scale={props.zoom * props.actualZoom}>
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
  setActualZoom: PropTypes.func.isRequired,
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
    setActualZoom: actualZoom => dispatch({ type: 'SET_ACTUAL_ZOOM', actualZoom })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
