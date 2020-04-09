import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '../util/helpers'

const sizes = [1, 1.5, 2, 3]
const pixelMultiplier = 15

// number, function, number ---> element
function circle(currentScale, scaleChoice, updateNode) {
  const pixelSize = (pixelMultiplier * scaleChoice).toString() + 'px'
  const wrapperStyle = { width: pixelSize }
  const circleStyle = { width: pixelSize, height: pixelSize }
  const onClick = () => updateNode({ scale: scaleChoice })
  const text = scaleChoice.toString() + 'x'
  const circleClass = classNames('circle', scaleChoice === currentScale ? 'current' : false)

  return (
    <div key={text}>
      <div style={wrapperStyle} className="circle-wrapper">
        <div onClick={onClick} style={circleStyle} className={circleClass}></div>
      </div>
      <div className="text">{text}</div>
    </div>
  )
}

export default function SizePicker({ scale, updateNode }) {
  return (
    <div className="sizepicker">
      { sizes.map(size => circle(scale, size, updateNode)) }
    </div>
  )
}

SizePicker.propTypes = {
  scale: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  updateNode: PropTypes.func.isRequired
}
