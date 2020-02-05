import React, { useEffect, useState, useRef } from 'react'

import PropTypes from 'prop-types'
import curry from 'lodash/curry'
import flow from 'lodash/flow'
import pick from 'lodash/pick'

import { addPaddingToRectangle } from '../../util/dimensions'

const refToBox = ref => pick(ref.current.getBBox(), 'x', 'y', 'width', 'height')
const padRectangle = curry(addPaddingToRectangle)(10)

export default function CaptionTextbox(props) {
  const textRef = useRef(null)
  const [rectProps, setRectProps] = useState(null)

  useEffect(() => {
    flow([refToBox, padRectangle, setRectProps])(textRef)
  }, [props.text, props.x, props.y])

  return  <g className="caption-textbox">
            { rectProps && <rect {...rectProps} className="background-rect" /> }

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
  width: 100
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
