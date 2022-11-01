import React, { useCallback, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { IoIosMore } from "react-icons/io"
import { FaLock } from "react-icons/fa"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"

import SaveButton from "./SaveButton"
import Confirm from "./Confirm"
import ShareModal from "./ShareModal"
import { useSelector } from "../util/helpers"
import { userIsOwnerSelector } from "../util/selectors"

export default function HeaderEditActions() {
  const dispatch = useDispatch()
  const { id, shareUrl, bugReportUrl } = useSelector(state => state.attributes)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const { clone: isCloneable, private: isPrivate } = useSelector(state => state.attributes.settings)

  const toggleRef = useRef() as React.RefObject<HTMLButtonElement>

  const [open, setOpen] = useState(false)
  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])

  const [showConfirm, setShowConfirm] = useState(false)
  const openConfirm = useCallback(() => {
    setShowConfirm(true)
    closeMenu()
  }, [closeMenu])

  const [showShare, setShowShare] = useState(false)
  const openShare = useCallback(() => {
    setShowShare(true)
    closeMenu()
  }, [closeMenu])
  const closeShare = useCallback(() => setShowShare(false), [])

  const exportImage = useCallback(() => {
    dispatch({ type: "EXPORT_IMAGE_REQUESTED" })
    closeMenu()
  }, [dispatch, closeMenu])

  const presentMap = useCallback(() => {
    dispatch({ type: "SET_EDITOR_MODE", enabled: false })
    dispatch({ type: "EXPAND_HEADER" })
  }, [dispatch])

  const cloneMap = useCallback(() => {
    dispatch({ type: "CLONE_REQUESTED" })
    closeMenu()
  }, [dispatch, closeMenu])

  const cancelDelete = useCallback(() => setShowConfirm(false), [])

  const confirmDelete = useCallback(() => {
    dispatch({ type: "DELETE_REQUESTED" })
    setShowConfirm(false)
  }, [dispatch])

  const openBugReportUrl = useCallback(() => {
    window.open(bugReportUrl, "_blank")
    closeMenu()
  }, [closeMenu, bugReportUrl])

  const canShare = userIsOwner && isPrivate && shareUrl
  const canClone = userIsOwner || isCloneable
  const canDelete = userIsOwner && id
  const canBug = Boolean(bugReportUrl)

  return (
    <div className="oligrapher-header-edit-actions">
      {isPrivate && (
        <span className="oligrapher-header-edit-actions-lock" title="This map is private">
          <FaLock />
        </span>
      )}

      <SaveButton />

      <div className="header-action-menu-wrapper">
        <IconButton
          id="toggle-action-menu"
          ref={toggleRef}
          aria-controls="simple-menu"
          aria-haspopup="true"
          size="small"
          onClick={openMenu}
        >
          <IoIosMore />
        </IconButton>

        <Menu
          id="header-action-menu"
          anchorEl={toggleRef.current}
          open={open}
          onClose={closeMenu}
          transitionDuration={0}
        >
          <MenuItem dense={true} onClick={presentMap}>
            Present
          </MenuItem>
          {/* ActionMenu is visible to editors but only owners can share or clone or delete */}
          {canShare && (
            <MenuItem dense={true} onClick={openShare}>
              Share
            </MenuItem>
          )}
          <MenuItem dense={true} onClick={exportImage}>
            Export
          </MenuItem>
          {canClone && (
            <MenuItem dense={true} onClick={cloneMap}>
              Clone
            </MenuItem>
          )}
          {canDelete && (
            <MenuItem dense={true} onClick={openConfirm}>
              Delete
            </MenuItem>
          )}
          {canBug && (
            <MenuItem dense={true} onClick={openBugReportUrl}>
              Report a bug
            </MenuItem>
          )}
        </Menu>

        <Confirm
          open={showConfirm}
          message={"Are you sure you want to delete this map?"}
          cancel={{ label: "Cancel", onClick: cancelDelete }}
          confirm={{ label: "Delete", onClick: confirmDelete }}
        />
        <ShareModal open={showShare} close={closeShare} url={shareUrl} />
      </div>
    </div>
  )
}
