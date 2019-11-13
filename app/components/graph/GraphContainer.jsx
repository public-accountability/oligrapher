import React from 'react'
import PropTypes from 'prop-types'
import Svg from './Svg'

// Renders a div (.oligrapher-graph-container) and the outer SVG element
// Uses `React.forwardRef` in order to pass a reference to the outermost div
// This reference is needed to calculate the "actual zoom"
const GraphContainer = React.forwardRef(function graphContainer(props, ref) {
  return <div className="oligrapher-graph-container" ref={ref}>
           <Svg outermost={true} viewBox={props.viewBox} height="500px"width="100%">
             {props.children}
           </Svg>
         </div>
})

GraphContainer.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox:  PropTypes.object.isRequired
}


export default GraphContainer
