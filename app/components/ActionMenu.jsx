import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosMore } from 'react-icons/io'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import ConfirmDelete from './ConfirmDelete'
import { userIsOwnerSelector } from '../util/selectors'

export default function ActionMenu() {
  const dispatch = useDispatch()
  const { id } = useSelector(state => state.attributes)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const isCloneable = useSelector(state => state.attributes.settings.clone)

  const [anchorEl, setAnchorEl] = useState() 
  const openMenu = useCallback(event => setAnchorEl(event.currentTarget), [])
  const closeMenu = useCallback(() => setAnchorEl(null), [])

  const [showModal, setShowModal] = useState(false)
  const openModal = useCallback(() => {
    setShowModal(true)
    closeMenu()
  }, [closeMenu])

  const presentMap = useCallback(
    () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: false }),
    [dispatch]
  )

  const cloneMap = useCallback(() => {
    dispatch({ type: 'CLONE_REQUESTED' })
    closeMenu()
  }, [dispatch, closeMenu])
 
  const cancelDelete = useCallback(() => setShowModal(false), [])
 
  const handleDelete = useCallback(() => {
    dispatch({ type: 'DELETE_REQUESTED' })
    setShowModal(false)
  }, [dispatch])

  return (
    <div className="header-action-menu-wrapper">
      <IconButton aria-controls="simple-menu" aria-haspopup="true" size="small" onClick={openMenu}>
        <IoIosMore />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem dense={true} onClick={presentMap}>Present</MenuItem>
        {/* ActionMenu is visible to editors but only owners can clone or delete */}
        { (userIsOwner || isCloneable) && <MenuItem dense={true} onClick={cloneMap}>Clone</MenuItem> }
        { userIsOwner && id && <MenuItem dense={true} onClick={openModal}>Delete</MenuItem> }
      </Menu>

      <ConfirmDelete open={showModal} close={cancelDelete} deleteMap={handleDelete} />
    </div>
  )
}