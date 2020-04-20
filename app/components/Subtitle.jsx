import React from 'react'
import PropTypes from 'prop-types'
import { isFunctionIfEditable } from '../util/types'
import { callWithTargetValue } from '../util/helpers'

export default function Subtitle({text, editable, onChange}) {
  if (!text && !editable) { return null }

  return (
    <div id="oligrapher-header-subtitle-wrapper">
      <h2>
        { editable
          ? <input 
              value={text}
              onChange={callWithTargetValue(onChange)}
              placeholder="Subtitle"/>
          : text
        }

      </h2>
    </div>
  )
}

Subtitle.propTypes = {
  text: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: isFunctionIfEditable
}
