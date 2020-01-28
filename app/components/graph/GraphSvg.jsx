import React from 'react'
import PropTypes from 'prop-types'
import Svg from './Svg'
import Markers from './Markers'

const GraphSvg = React.forwardRef((props, ref)  => {
  return <Svg outermost={true} viewBox={props.viewBox} height="500px "width="100%" ref={ref}>
           <Markers />
           {props.children}
         </Svg>
})

GraphSvg.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox:  PropTypes.object.isRequired,
}

export default GraphSvg
