import React from 'react'

const sizes = [1, 1.5, 2, 3]
const pixelMultiplier = 15

function circle(scale) {
  const pixelSize = (pixelMultiplier * scale).toString() + 'px'
  const wrapper = { width: pixelSize }
  const circle = { width: pixelSize, height: pixelSize }
  const text = scale.toString() + 'x'

  return <div key={text}>
           <div style={wrapper} className="circle-wrapper">
             <div style={circle} className="circle"></div>
           </div>
           <div className="text">{text}</div>
         </div>
}


export default function SizePicker(props) {
  return <div className="sizepicker">
           { sizes.map(circle) }
         </div>
}


SizePicker.propTypes = {

}
