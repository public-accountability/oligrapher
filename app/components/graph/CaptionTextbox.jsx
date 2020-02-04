import React, { useState } from 'react'
import PropTypes from 'prop-types'

/*


*/

export default function CaptionTextbox(props) {
  const [ focus, setFocus ] = useState(props.startFocused)

  return <g className="caption-textbox">
           <text x={props.x} y={props.y}>
             {props.text}
           </text>
         </g>

}

// export function CaptionTextbox(props) {
//   return <foreignObject x={props.x} y={props.y}>
//            <div xmlns="http://www.w3.org/1999/xhtml"
//                      className="caption-text"
//                      value={props.text}
//                      onChange={props.handleTextChange}
//                      style={{backgroundColor: 'red'}}
//            >
//            </div>
//          </foreignObject>
// }

CaptionTextbox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  startFocused: PropTypes.bool,
  width: PropTypes.number
}

CaptionTextbox.defaultProps = {
  width: 100,
  startFocused: false
}


// export default CaptionTextbox
