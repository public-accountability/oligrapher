import React from 'react'
import PropTypes from 'prop-types'

export default function Zoomable({zoom, children}) {
  return <g transform={`scale(${zoom})`} className="graph-zoom-container">
           {children}
         </g>
}


Zoomable.propTypes = {
  zoom: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}
