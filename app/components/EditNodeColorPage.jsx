import React from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

const COLOR_OPTIONS = [
  '#CCCCCC', // <--- oligrapher default node color
  '#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', 
  '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', 
  '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF'
]

export default function EditNodeColorPage({ color, updateNode }) {
  const handleColorChange = color => {
    updateNode({ color: color.hex })
  }

  return <SketchPicker color={color} presetColors={COLOR_OPTIONS} onChangeComplete={handleColorChange}/>
}

EditNodeColorPage.propTypes = {
  color: PropTypes.string.isRequired,
  updateNode: PropTypes.func.isRequired
}
