import React, { useCallback, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosMore } from 'react-icons/io'
import { IconButton, Menu, MenuItem } from '@material-ui/core'

import ConfirmDelete from './ConfirmDelete'
import { userIsOwnerSelector } from '../util/selectors'

export default function ActionMenu() {
  const dispatch = useDispatch()
  const { id } = useSelector(state => state.attributes)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const toggleRef = useRef()

  const [open, setOpen] = useState(false)
  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])

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
      <IconButton id="toggle-action-menu" ref={toggleRef} aria-controls="simple-menu" aria-haspopup="true" size="small" onClick={openMenu}>
        <IoIosMore />
      </IconButton>

      <Menu
        id="header-action-menu"
        anchorEl={toggleRef.current}
        open={open}
        onClose={closeMenu}
        transitionDuration={0}
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