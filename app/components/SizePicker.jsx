import React from 'react'
import PropTypes from 'prop-types'
import { classNames } from '../util/helpers'
import curry from 'lodash/curry'

const sizes = [1, 1.5, 2, 3]
const pixelMultiplier = 15

// number, function, number ---> element
function circle(currentScale, setScale, scaleChoice) {
  const pixelSize = (pixelMultiplier * scaleChoice).toString() + 'px'
  const wrapperStyle = { width: pixelSize }
  const circleStyle = { width: pixelSize, height: pixelSize }
  const onClick = () => setScale(scaleChoice)
  const text = scaleChoice.toString() + 'x'
  const circleClass = classNames('circle', scaleChoice === currentScale ? 'current' : false)

  return <div key={text}>
           <div style={wrapperStyle} className="circle-wrapper">
             <div onClick={onClick} style={circleStyle} className={circleClass}></div>
           </div>
           <div className="text">{text}</div>
         </div>
}


export default function SizePicker(props) {
  return <div className="sizepicker">
           { sizes.map(curry(circle)(props.scale, props.setScale)) }
         </div>
}


SizePicker.propTypes = {
  scale: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setScale: PropTypes.func.isRequired
}
