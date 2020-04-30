import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'

export default function EditMenuHeader({ title }) {
  const dispatch = useDispatch()

  return (
    <header className="edit-menu-header">
      <div>{title}</div>
      <div>
        <button onClick={() => dispatch({ type: 'CLOSE_EDITOR' })}>
          <MdClose />
        </button>
      </div>
    </header>
  )
}

EditMenuHeader.propTypes = {
  title: PropTypes.string.isRequired
}
