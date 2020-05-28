import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'
import uniq from 'lodash/uniq'

const DEFAULT_COLOR = '#CCC'

const COLOR_OPTIONS = [
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', 
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', 
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B'
]

export default function EditNodeColorPage({ color, onChange, colors = [] }) {
  const handleColorChange = useCallback(color => {
    onChange(color.hex)
  }, [onChange])

  const options = uniq(
    [DEFAULT_COLOR]
      .concat(colors)
      .concat(COLOR_OPTIONS)
      .map(color => color.toLowerCase())
  ).slice(0, 16)

  return (
    <SketchPicker
      color={color}
      presetColors={options}
      onChangeComplete={handleColorChange}
      style={{ boxShadow: 'none' }} />
  )
}

EditNodeColorPage.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  colors: PropTypes.array
}