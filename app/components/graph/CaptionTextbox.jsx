import React from 'react'
import PropTypes from 'prop-types'

export function CaptionTextbox(props) {
  return <foreignObject x={props.x} y={props.y} width="100%" height="100%">
           <span xmlns="http://www.w3.org/1999/xhtml" className="caption-text">
             {props.text}
           </span>
         </foreignObject>
}

CaptionTextbox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
}

export default React.memo(CaptionTextbox)
