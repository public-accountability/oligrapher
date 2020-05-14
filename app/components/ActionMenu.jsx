import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosMore } from 'react-icons/io'

import ConfirmDelete from './ConfirmDelete'
import { userIsOwnerSelector } from '../util/selectors'

export default function ActionMenu() {
  const dispatch = useDispatch()
  const { id } = useSelector(state => state.attributes)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const divRef = useRef()

  const [showModal, setShowModal] = useState(false)
  const openModal = useCallback(() => setShowModal(true), [])

  const [menuIsOpen, setMenuIsOpen] = useState(false) 
  const toggleMenu = useCallback(() => setMenuIsOpen(!menuIsOpen), [menuIsOpen])
  const closeMenu = useCallback(() => setMenuIsOpen(false), [])

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
    closeMenu()
  }, [dispatch, closeMenu])

  useEffect(() => {
    if (menuIsOpen) {
      divRef.current.focus()
    }
  }, [menuIsOpen])

  return (
    <div className="header-action-menu-wrapper" ref={divRef} tabIndex="0" onBlur={closeMenu}>
      <div>
        <span className="toggle-action-menu" onClick={toggleMenu}><IoIosMore /></span>
      </div>

      { menuIsOpen && 
        <div style={{position: "relative"}}>
          <div className="header-action-menu">
            <ul>
              <li onClick={presentMap}>
                Present
              </li>
              {/* ActionMenu is visible to editors but only owners can clone or delete */}
              { userIsOwner && <hr /> }
              { (userIsOwner || isCloneable) && <li onClick={cloneMap}>Clone</li> }
              { userIsOwner && id && <li onClick={openModal}>Delete</li> }
            </ul>
          </div>
        </div>
      }

      <ConfirmDelete open={showModal} close={cancelDelete} deleteMap={handleDelete} />
    </div>
  )
}