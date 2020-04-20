import React from 'react'
import PropTypes from 'prop-types'

import noop from 'lodash/noop'

export default function EditMenuSubmitButtons({ handleSubmit, handleDelete, hideDeleteButton, hideSubmitButton, page, setPage })  {
  return (
    <div className="edit-menu-submit-buttons">
      { !hideDeleteButton && page === 'main' && <button name="delete" onClick={handleDelete}>Delete</button> }
      { page !== 'main' && <button name="back" onClick={() => setPage('main')}>Back</button> }
      { !hideSubmitButton && <button name="update" onClick={handleSubmit}>✓</button> }
    </div>
  )
}

EditMenuSubmitButtons.propTypes = {
  handleSubmit: PropTypes.func,
  handleDelete: PropTypes.func,
  hideSubmitButton: PropTypes.bool,
  hideDeleteButton: PropTypes.bool,
  page: PropTypes.string.isRequired,
  setPage: PropTypes.func
}

EditMenuSubmitButtons.defaultProps = {
  setPage: noop,
  handleSubmit: noop,
  handleDelete: noop,
  hideSubmitButton: false,
  hideDeleteButton: false
}
