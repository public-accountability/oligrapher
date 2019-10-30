import React from 'react'
import PropTypes from 'prop-types'

import noop from 'lodash/noop'
import values from 'lodash/values'

import { Edge as LegacyEdge } from '../../../legacy-app/components/Edge'

function legacyEdge(edge, zoom) {
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


export default function Edges(props) {
  return <g className="edges">
           { values(props.edges).map( edge => legacyEdge(edge, props.zoom) ) }
         </g>

}

Edges.propTypes = {
  edges: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired
}
