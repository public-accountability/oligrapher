import React from 'react'
import PropTypes from 'prop-types'

export default function EditCaptionFont({ value, onChange }) {
  const FONT_FAMILY_OPTIONS = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Monospace', label: 'Monospace'},
    { value: 'Times New Roman', label: 'Times New Roman' }
  ]

  return (
    <select className="edit-caption-font" onChange={onChange} value={value}>
      { FONT_FAMILY_OPTIONS.map(({ value, label }) => <option value={value} key={value}>{label}</option>) }
    </select>
  )
}

EditCaptionFont.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}