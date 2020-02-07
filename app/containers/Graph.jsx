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
           <Svg outermost={true} viewBox={props.viewBox} height="500px "width="100%" ref={svgRef}>
             <Markers />
             <Zoomable zoom={props.zoom}>
               <Pannable zoom={props.zoom} actualZoom={props.actualZoom}>
                 <Clickable>
                   <Nodes />
                   <Edges />
                   <Captions />
                 </Clickable>
               </Pannable>
             </Zoomable>
           </Svg>
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
    setActualZoom: actualZoom => dispatch({ type: 'SET_ACTUAL_ZOOM', actualZoom }),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)
