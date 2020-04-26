import React from 'react'
import PropTypes from 'prop-types'
import toString from 'lodash/toString'
import range from 'lodash/range'

export default function EditCaptionSize({ value, onChange }) {
  const FONT_SIZE_OPTIONS = range(8, 31, 2).map(toString).map(i => ({ value: i, label: i }))

  return (
    <select className="edit-caption-size" onChange={onChange} value={value}>
      { FONT_SIZE_OPTIONS.map(({ value, label }) => <option value={value} key={value}>{label}</option>) }
    </select>
  )
}

EditCaptionSize.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}