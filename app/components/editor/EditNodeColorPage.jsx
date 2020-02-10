import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

export default function EditNodeColorPage(props) {
  const [color, setColor] = useState(props.color)

  useEffect(() => void setColor(props.color), [props.color])

  const handleColorChange = color => {
    setColor(color.hex)
    props.onChange(color.hex)
  }

  return <SketchPicker color={color} onChangeComplete={handleColorChange}/>
}


EditNodeColorPage.propTypes = {
  color: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
