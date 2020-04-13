import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

export default function ActionMenu({toggleActionMenu}) {
  const dispatch = useDispatch()

  const openEditorsMenu = useCallback(
    function() {
      dispatch({ type: 'OPEN_TOOL', item: 'editors' })
      toggleActionMenu()
    },
    [dispatch, toggleActionMenu]
  )

  return (
    <div style={{position: "relative"}}>
      <div className="header-action-menu">
        <ul>
          <li onClick={() => dispatch({type: 'SET_MODE', mode: 'editor', enabled: false})}>
            Present
          </li>
          <li onClick={openEditorsMenu}>
            Editors
          </li>
          <hr />
          <li>Clone</li>
          <li>Delete</li>
          <li>Create New</li>
          <hr />
          <li>Share</li>
          <li>Print</li>
          <li>Export</li>
        </ul>
      </div>
    </div>
  )
}


ActionMenu.propTypes = {
  toggleActionMenu: PropTypes.func.isRequired
}
