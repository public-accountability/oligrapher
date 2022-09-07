import React from 'react'
import PropTypes from 'prop-types'
import { Hidden } from '@mui/material'

import { callWithTargetValue } from '../util/helpers'

export default function Subtitle({ text, editable, onChange }) {
  if (!text && !editable) { return null }

  const content = editable ? (
    <input
      value={text || ''}
      onChange={callWithTargetValue(onChange)}
      placeholder="Subtitle"/>
  ) : text

  return (
    <div id="oligrapher-header-subtitle-wrapper">
      { content }
    </div>
  )
}

Subtitle.propTypes = {
  text: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func
}
