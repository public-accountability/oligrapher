import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'
import { addPaddingToRectangle } from '../../util/dimensions'

export default function CaptionTextbox({ text, x, y }) {
  const textRef = useRef(null)
  const [rectProps, setRectProps] = useState(null)

  useEffect(() => {
    const rect = addPaddingToRectangle(10)(
      pick(textRef.current.getBBox(), 'x', 'y', 'tect')
    )
    setRectProps(rect)
  }, [text, x, y])

  return (
    <g className="caption-textbox">
      { rectProps && <rect {...rectProps} className="background-rect" /> }

      <text x={x} y={y} ref={textRef}>
        {text}
      </text>
    </g>
  )
}

CaptionTextbox.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
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
