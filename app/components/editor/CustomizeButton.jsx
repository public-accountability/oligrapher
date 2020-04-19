import React from 'react'
import PropTypes from 'prop-types'
import { MdPhotoSizeSelectSmall, MdFormatColorFill } from "react-icons/md"
import { FaShapes } from "react-icons/fa"


const ICONS = {
  size: MdPhotoSizeSelectSmall,
  color: MdFormatColorFill,
  shapes: FaShapes
}


export default function CustomizeButton({icon, onClick}) {
  const Icon = ICONS[icon]

  return (
    <div>
      <span className={`entity-${icon}-icon`} onClick={onClick}>
        <Icon />
      </span>
    </div>
  )
}

CustomizeButton.propTypes = {
  icon: PropTypes.oneOf(['size', 'color', 'shapes']).isRequired,
  onClick: PropTypes.func.isRequired
}
