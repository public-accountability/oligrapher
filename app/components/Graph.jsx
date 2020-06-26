import React, { useRef, useEffect } from 'react'
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
import Selectable from './Selectable'
import Highlightable from './Highlightable'
import { calculateViewBox } from '../graph/graph'

/*
  The core component that displays the graph
*/
export function Graph(props) {
  const {
    viewBox, zoom, svgSize: { width, height }, setSvgWidth, storyMode
  } = props

  const svgRef = useRef(null)

  useEffect(() => {
    setSvgWidth(svgRef.current.getBoundingClientRect().width)
  }, [setSvgWidth, storyMode])
  
  return (
    <div id="oligrapher-graph-svg" style={{ height: height + "px" }}>
      <Svg outermost={true} viewBox={viewBox} height={height + "px"} ref={svgRef}>
        <Filters />
        <Markers />
        <Zoomable zoom={zoom}>
          <Pannable>
            {/* don't show graph until svg dimensions have been set */}
            { height && width ? (
              <Selectable>
                <Highlightable>
                  <Edges />
                  <Nodes />
                  <Captions />
                </Highlightable>
              </Selectable>
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
  setSvgWidth: PropTypes.func.isRequired,
  rootContainerId: PropTypes.string.isRequired,
  storyMode: PropTypes.bool.isRequired
}

const calculateAnnotationViewBox = state => {
  // show normal viewbox if editing or annotations hidden
  if (state.display.modes.editor || !state.display.modes.story) {
    return state.display.viewBox
  }

  const { list, currentIndex } = state.annotations
  const annotation = list[currentIndex]

  if (annotation) {
    let { nodes, edges, captions } = state.graph
    const { nodeIds, edgeIds, captionIds } = annotation

    // show normal viewbox if no highlights
    if (nodeIds.length + edgeIds.length + captionIds.length === 0) {
      return state.display.viewBox
    }

    nodes = Object.values(nodes).filter(node => nodeIds.includes(node.id))
    edges = Object.values(edges).filter(edge => edgeIds.includes(edge.id))
    captions = Object.values(captions).filter(caption => captionIds.includes(caption.id))

    return calculateViewBox(nodes, edges, captions)
  } else {
    return state.display.viewBox
  }
}

const mapStateToProps = state => {
  const viewBox = calculateAnnotationViewBox(state)
  const { zoom, svgSize} = state.display
  const storyMode = state.display.modes.story

  return {
    viewBox, zoom, svgSize, storyMode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSvgWidth: width => dispatch({ type: 'SET_SVG_WIDTH', width })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)