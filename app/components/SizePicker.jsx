import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '../util/helpers'

const sizes = [1, 1.5, 2, 3]
const pixelMultiplier = 15

// number, function, number ---> element
function circle(currentScale, scaleChoice, onChange) {
  const pixelSize = (pixelMultiplier * scaleChoice).toString() + 'px'
  const wrapperStyle = { width: pixelSize }
  const circleStyle = { width: pixelSize, height: pixelSize }
  const onClick = () => onChange(scaleChoice)
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

export default function SizePicker({ scale, onChange }) {
  return (
    <div className="sizepicker">
      { sizes.map(size => circle(scale, size, onChange)) }
    </div>
  )
}

SizePicker.propTypes = {
  scale: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired
}
