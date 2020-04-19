import React from 'react'
import PropTypes from 'prop-types'

import { isFunctionIfEditable } from '../util/types'
import { callWithTargetValue } from '../util/helpers'

export default function Title({text, editable, onChange}) {

  return (
    <div id="oligrapher-header-title-wrapper">
      <h1>
        {
          editable 
          ? <input value={text}
              onChange={callWithTargetValue(onChange)}
              placeholder="Title" />
          : text
        }
      </h1>
    </div>
  )
}

Title.propTypes = {
  text:     PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: isFunctionIfEditable
}
