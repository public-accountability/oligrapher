import React from 'react'
import PropTypes from 'prop-types'

import EditMenuCloseButton from './EditMenuCloseButton'

export default function EditMenuHeader(props) {
  return (
    <header className="edit-menu-header">
      <div>{props.title}</div>
      <div><EditMenuCloseButton /></div>
    </header>
  )
}

EditMenuHeader.propTypes = {
  title: PropTypes.string.isRequired
}
