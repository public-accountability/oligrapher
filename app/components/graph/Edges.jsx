import React from 'react'
import PropTypes from 'prop-types'

import noop from 'lodash/noop'
import values from 'lodash/values'


import { svgParams } from '../../graph/edge'
import { Edge as LegacyEdge } from '../../../legacy-app/components/Edge'
import Edge from './Edge'

function legacyEdge(edge, zoom) {
  // console.log('edge', edge)
  return <LegacyEdge ref={noop}
                     key={edge.id}
                     edge={edge}
                     graphId="exampleGraphId"
                     zoom={zoom}
                     selected={null}
                     clickEdge={noop}
                     moveEdge={noop}
                     isLocked={noop}
                     updateArrow={noop} />
}

function newEdge(edge) {
  console.log('edge', edge)
  console.log('svgParams', svgParams(edge))

  return <Edge edge={edge} />
}

// { values(props.edges).map( edge => legacyEdge(edge, props.zoom) ) }
export default function Edges(props) {
  return <g className="edges">
           { values(props.edges).map( edge => newEdge(edge) ) }
         </g>
}

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired
}
