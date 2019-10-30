import React from 'react'
import PropTypes from 'prop-types'
import Svg from './Svg'

// Renders a div (.oligrapher-graph-container) and the outer SVG element
export default function GraphContainer(props) {
  return <div className="oligrapher-graph-container">
           <Svg outermost={true} viewBox={props.viewBox} height="500px"width="100%">
             {props.children}
           </Svg>
         </div>
}

GraphContainer.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox:  PropTypes.object.isRequired
}
