import React from 'react'
import PropTypes from 'prop-types'

import noop from 'lodash/noop'

export default function EditMenuSubmitButtons({handleSubmit, handleDelete, hideDeleteButton, page, setPage})  {
  return <div className="edit-menu-submit-buttons">
           { !hideDeleteButton && page === 'main' && <button name="delete" onClick={handleDelete}>Delete</button> }
           { page !== 'main' && <button name="back" onClick={() => setPage('main')}>Back</button> }
           <button name="update" onClick={handleSubmit}>✓</button>
         </div>
}

EditMenuSubmitButtons.propTypes = {
  handleSubmit:       PropTypes.func.isRequired,
  handleDelete:       PropTypes.func,
  hideDeleteButton:   PropTypes.bool,
  page:               PropTypes.string.isRequired,
  setPage:            PropTypes.func
}

EditMenuSubmitButtons.defaultProps = {
  setPage: noop,
  handleDelete: noop,
  hideDeleteButton: false
}
