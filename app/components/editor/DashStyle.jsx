import React, { useState } from 'react'
import PropTypes from 'prop-types'

import toNumber from 'lodash/toNumber'
import isEqual from 'lodash/isEqual'
import { callWithTargetValue } from '../../util/helpers'

// example dash value: "3 5"
// 3 is length, 5 is gap
// String | Boolean => Array
const parseDash = strDash => strDash ? strDash.split(" ").map(toNumber) : [0, 0]
// Array => null | String
const serializeDash = dashArray => isEqual(dashArray, [0, 0]) ? null : dashArray.join(' ')

export default function DashStyle(props) {
  // dash = [length, gap]
  const [dash, setDash] = useState(parseDash(props.dash))

  const update = newDash => {
    setDash(newDash)
    props.onChange(serializeDash(newDash))
  }

  const updateDash = dashComponent => callWithTargetValue(value => {
    if (dashComponent === 'length') {
      update([value, dash[1]].map(toNumber))
    } else if (dashComponent === 'gap') {
      update([dash[0], value].map(toNumber))
    }
  })

  return (
    <div className="edit-edge-dash-style">
      <input className="input-dash-length"
              type="number"
              value={dash[0]}
              min={0}
              onChange={updateDash('length')}
        />
      <input className="gap-dash-length"
              type="number"
              value={dash[1]}
              min={0}
              onChange={updateDash('gap')}
      />
    </div>
  )
}

DashStyle.propTypes = {
  dash:      PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange:  PropTypes.func.isRequired
}
