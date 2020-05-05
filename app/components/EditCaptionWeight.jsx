import React from 'react'
import PropTypes from 'prop-types'

export default function EditCaptionWeight({ value, onChange }) {
  const FONT_WEIGHT_OPTIONS = [
    { value: '400', label: 'Normal'},
    { value: '700', label: 'Bold' },
    // { value: '200', label: 'Light'}
  ]

  return (
    <select className="edit-caption-weight" onChange={onChange} value={value}>
      { FONT_WEIGHT_OPTIONS.map(({ value, label }) => <option value={value} key={value}>{label}</option>) }
    </select>
  )
}

EditCaptionWeight.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}