import React from 'react'
import PropTypes from 'prop-types'

import values from 'lodash/values'
import noop from 'lodash/noop'

import { Node as LegacyNode } from '../../../legacy-app/components/Node'
import Node from './Node'
import Graph from '../../graph/graph'


function legacyNode(node, graph, zoom) {
  return <LegacyNode ref={noop}
                     key={node.id}
                     node={node}
                     graph={graph}
                     zoom={zoom}
                     selected={null}
                     clickNode={noop}
                     moveNode={noop}
                     isLocked={false} />
}



function newNode(node) {
  return <Node key={node.id} node={node} />
}

export default function Nodes({graph, zoom, updateEdge }) {
  // let edgesOf = Graph.edgesOf(graph)

  return <g className="nodes">
           {/* values(graph.nodes).map(node => legacyNode(node, graph, zoom)) */}
           {values(graph.nodes).map(node => newNode(node) ) }
         </g>
}

Nodes.propTypes = {
  graph:        PropTypes.object.isRequired,
  zoom:         PropTypes.number.isRequired,
  updateEdge:   PropTypes.func.isRequired
}
