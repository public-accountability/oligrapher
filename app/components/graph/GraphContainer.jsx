import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Svg from './Svg'
import Markers from './Markers'
import { SvgRefContext } from '../../contexts'


export default function GraphContainer(props) {
  const svgRef = useContext(SvgRefContext)

  return <div className="oligrapher-graph-svg" ref={svgRef}>
           <Svg outermost={true} viewBox={props.viewBox} height="500px "width="100%">
             <Markers />
             {props.children}
           </Svg>
         </div>
}

GraphContainer.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox:  PropTypes.object.isRequired
}
