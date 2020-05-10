import React, { useCallback, useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'
import { IoIosMore } from 'react-icons/io'

export default function ActionMenu() {
  const dispatch = useDispatch()
  const { id } = useSelector(state => state.attributes)
  const rootElement = document.querySelector("#oligrapher-container")
  const divRef = useRef()

  const [showModal, setShowModal] = useState(false)
  const openModal = useCallback(() => setShowModal(true), [])

  const [menuIsOpen, setMenuIsOpen] = useState(false) 
  const toggleMenu = useCallback(() => setMenuIsOpen(!menuIsOpen), [menuIsOpen])
  const closeMenu = useCallback(() => setMenuIsOpen(false), [])

  const openEditorsMenu = useCallback(
    function() {
      dispatch({ type: 'OPEN_TOOL', item: 'editors' })
      closeMenu()
    },
    [dispatch, closeMenu]
  )

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

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 30
    },
    overlay: {
      backgroundColor: "rgba(192, 192, 192, 0.5)",
      zIndex: 20
    }
  }

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
              <li onClick={openEditorsMenu}>
                Editors
              </li>
              <hr />
              <li onClick={cloneMap}>Clone</li>
              { id && <li onClick={openModal}>Delete</li> }
              {/* <li>Create New</li> */}
              {/* <hr /> */}
              {/* <li>Share</li>
              <li>Print</li>
              <li>Export</li> */}
            </ul>
          </div>
        </div>
      }

      <ReactModal 
        isOpen={showModal} 
        appElement={rootElement} 
        style={modalStyle}
        contentLabel="Confirm delete"
        onRequestClose={cancelDelete}>
        <div className="confirm-delete">
          <div>Are you sure you want to delete this map?</div>
          <div className="modal-buttons">
            <button className="modal-button" name="delete" onClick={handleDelete}>Delete</button>
            &nbsp;&nbsp;&nbsp;
            <button className="modal-button" name="cancel" onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      </ReactModal>    
    </div>
  )
}