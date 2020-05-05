import React, { useState } from 'react'
import PropTypes from 'prop-types'
import toNumber from 'lodash/toNumber'

import { callWithTargetValue } from '../util/helpers'

export default function ScaleStyle(props) {
  const [scale, setScale] = useState(props.scale)

  const onChange = callWithTargetValue( value => {
    let scale = toNumber(value)
    setScale(scale)
    props.updateScale(scale)
  })

  return (
    <div className="edit-edge-scale-style">
      <input 
        className="input-scale"
        type="number"
        min={1}
        max={10}
        value={scale}
        onChange={onChange} />
    </div>
  )
}

ScaleStyle.propTypes = {
  scale: PropTypes.number.isRequired,
  updateScale: PropTypes.func.isRequired
}
