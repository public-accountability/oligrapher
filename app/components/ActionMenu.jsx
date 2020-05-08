import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ReactModal from 'react-modal'

export default function ActionMenu({toggleActionMenu}) {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const { id } = useSelector(state => state.attributes)
  const rootElement = document.querySelector("#oligrapher-container")

  const openEditorsMenu = useCallback(
    function() {
      dispatch({ type: 'OPEN_TOOL', item: 'editors' })
      toggleActionMenu()
    },
    [dispatch, toggleActionMenu]
  )

  const presentMap = useCallback(
    () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: false }),
    [dispatch]
  )

  const cloneMap = useCallback(() => dispatch({ type: 'CLONE_REQUESTED' }), [dispatch])
 
  const openModal = useCallback(() => setShowModal(true), [])
  const cancelDelete = useCallback(() => setShowModal(false), [])
  const handleDelete = useCallback(() => {
    dispatch({ type: 'DELETE_REQUESTED' })
    setShowModal(false)
  }, [dispatch])

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
    <>
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
    </>
  )
}


ActionMenu.propTypes = {
  toggleActionMenu: PropTypes.func.isRequired
}
