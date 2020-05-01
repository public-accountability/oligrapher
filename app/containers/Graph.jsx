import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Edges from './Edges'
import Nodes from './Nodes'
import Captions from './Captions'
import Svg from '../components/graph/Svg'
import Markers from '../components/graph/Markers'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'
import EdgeCreationMessage from "./EdgeCreationMessage"
import Edge from '../graph/edge'
import { findIntersectingNode } from '../graph/node'
import { translatePoint } from '../util/helpers'

export const NodeDraggingContext = React.createContext()

/*
  The core component that displays the graph
*/
export function Graph({ viewBox, zoom, svgSize, nodes, setSvgSize, moveNode, addEdge, openEdgeEditor }) {
  const headerHeight = 190 // set in css
  const [intersectingNodes, setIntersectingNodes] = useState(null)

  // each edge will use edgesRef to register an endpoint updater
  // to be used by dragNode below
  const edgesRef = useRef({})

  // dragNode is provided by NodeDraggingContext to all nodes so that
  // edge curves can be updated during drag without using the store
  const handleNodeDrag = useCallback((node, deltas) => {
    const position = translatePoint(node, deltas)

    node.edgeIds.forEach(edgeId =>
      edgesRef.current[edgeId].updateEndpoint(node.id, position)
    )

    const intersectingNode = findIntersectingNode(nodes, position, node.id)

    if (intersectingNode) {
      setIntersectingNodes([node, intersectingNode])
    } else {
      setIntersectingNodes(null)
    }
  }, [edgesRef, nodes])

  const handleNodeMove = useCallback((node, deltas) => {
    if (intersectingNodes) {
      const edge = Edge.new({ node1_id: node.id, node2_id: intersectingNodes[1].id })
      moveNode(node.id, { x: 0, y: 0 }) // return node to state before drag
      handleNodeDrag(node, { x: 0, y: 0 }) // return node's existing edges to state before drag
      addEdge(edge)
      openEdgeEditor(edge.id)
    } else {
      moveNode(node.id, deltas)
    }
  }, [moveNode, addEdge, openEdgeEditor, intersectingNodes, handleNodeDrag])

  const nodeDraggingContext = useMemo(() => ({
    handleNodeDrag, handleNodeMove
  }), [handleNodeDrag, handleNodeMove])

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
            <NodeDraggingContext.Provider value={nodeDraggingContext}>
              <Edges ref={edgesRef} />
              <Nodes />
              <Captions />
            </NodeDraggingContext.Provider>
          </Pannable>
        </Zoomable>
      </Svg>
      { intersectingNodes && 
        ReactDOM.createPortal(
          <EdgeCreationMessage nodes={intersectingNodes} />,
          document.getElementById('oligrapher-graph-svg')
        )
      }
    </div>
  )
}

Graph.propTypes = {
  viewBox: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  svgSize: PropTypes.object,
  nodes: PropTypes.object.isRequired,
  setSvgSize: PropTypes.func.isRequired,
  moveNode: PropTypes.func.isRequired,
  addEdge: PropTypes.func.isRequired,
  openEdgeEditor: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const { viewBox, zoom, svgSize } = state.display
  const { nodes } = state.graph.present

  return {
    viewBox, zoom, svgSize, nodes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setSvgSize: size => dispatch({ type: 'SET_SVG_SIZE', size }),
    moveNode: (id, deltas) => dispatch({ type: 'MOVE_NODE', id, deltas }),
    addEdge: edge => dispatch({ type: 'ADD_EDGE', edge }),
    openEdgeEditor: id => dispatch({ type: 'OPEN_EDITOR', id, editorType: 'edge' })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Graph)