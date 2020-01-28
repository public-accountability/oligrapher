import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// Core Graph Elements
import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'

// Graph Display Components
import GraphSvg from '../components/graph/GraphSvg'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'

import { computeActualZoom } from '../util/dimensions'

/*
  The core component that displays the graph
*/
export function Graph(props) {
  // The two dom references are used to calculate the actual zoom and caption placement.
  const svgRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    props.setActualZoom(computeActualZoom(props.viewBox, svgRef.current, props.zoom))
  }, [props.zoom, props.viewBox])

  return <div ref={containerRef} className="oligrapher-graph-svg">
           <GraphSvg ref={svgRef} viewBox={props.viewBox}>
             <Zoomable zoom={props.zoom}>
               <Pannable zoom={props.zoom} actualZoom={props.actualZoom}>
                 <Nodes />
                 <Edges />
                 <Captions />
               </Pannable>
             </Zoomable>
           </GraphSvg>
         </div>
}

Graph.propTypes = {
  viewBox: PropTypes.object.isRequired,
  setActualZoom: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  actualZoom: PropTypes.number
}

const mapStateToProps = function(state) {
  return {
    viewBox: state.graph.viewBox,
    zoom: state.graph.zoom,
    actualZoom: state.graph.actualZoom
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    setActualZoom: (actualZoom) => dispatch({ type: 'SET_ACTUAL_ZOOM', actualZoom })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
