import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'


export default function CaptionTextbox(props) {
  const textRef = useRef(null)
  const [backgroundProps, setBackgroundProps] = useState(null)

  useEffect(() => {
    setBackgroundProps(pick(textRef.current.getBBox(), 'x', 'y', 'width', 'height'))
  }, [props.text])

  return <g className="caption-textbox">
           { backgroundProps && <rect {...backgroundProps} className="background-rect" /> }

           <text x={props.x} y={props.y} ref={textRef}>
             {props.text}
           </text>

         </g>

}

CaptionTextbox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  width: PropTypes.number
}

CaptionTextbox.defaultProps = {
  width: 100,
  startFocused: false
}


// export default CaptionTextbox

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
