import React, { useCallback, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { IoIosMore } from "react-icons/io"

import { useSelector } from "../util/helpers"
import { annotationsListSelector, embeddedUrlSelector } from "../util/selectors"
import AnnotationsToggler from "./AnnotationsToggler"
import Disclaimer from "./Disclaimer"
import ShareModal from "./ShareModal"
import EmbedForm from "./EmbedForm"
import { userIsOwnerSelector, userCanEditSelector } from "../util/selectors"

export default function HeaderActions() {
  const dispatch = useDispatch()
  const userIsOwner = useSelector(userIsOwnerSelector)
  const userCanEdit = useSelector(userCanEditSelector)
  const user = useSelector(state => state.attributes.user)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const isPrivate = useSelector(state => state.attributes.settings.private)
  const shareUrl = useSelector(state => state.attributes.shareUrl)
  const embeddedUrl = useSelector(embeddedUrlSelector)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const canClone = userIsOwner || (user && isCloneable)
  const canShare = userIsOwner && isPrivate && shareUrl
  const list = useSelector(annotationsListSelector)
  const { storyModeOnly, exploreModeOnly } = useSelector(state => state.attributes.settings)
  const hideAnnotationsToggler = storyModeOnly || exploreModeOnly || list.length < 1

  const toggleRef = useRef()
  const [open, setOpen] = useState(false)
  const openMenu = useCallback(() => setOpen(true), [])
  const closeMenu = useCallback(() => setOpen(false), [])

  const enableEditorMode = useCallback(() => {
    dispatch({ type: "SET_EDITOR_MODE", enabled: true })
    closeMenu()
  }, [dispatch, closeMenu])

  const clone = useCallback(() => {
    dispatch({ type: "CLONE_REQUESTED" })
    closeMenu()
  }, [dispatch, closeMenu])

  const openShare = useCallback(() => {
    setShowShare(true)
    closeMenu()
  }, [closeMenu])
  const closeShare = useCallback(() => setShowShare(false), [])

  const openDisclaimer = useCallback(() => {
    setShowDisclaimer(true)
    closeMenu()
  }, [closeMenu])
  const closeDisclaimer = useCallback(() => setShowDisclaimer(false), [])

  const exportImage = useCallback(() => {
    dispatch({ type: "EXPORT_IMAGE_REQUESTED" })
    closeMenu()
  }, [dispatch, closeMenu])

  const embedRef = useRef()
  const toggleEmbed = useCallback(() => setShowEmbed(!showEmbed), [showEmbed])
  const closeEmbed = useCallback(() => setShowEmbed(false), [])

  return (
    <div className="oligrapher-header-actions">
      {hideAnnotationsToggler || <AnnotationsToggler />}

      {embeddedUrl && (
        <Button size="small" variant="outlined" onClick={toggleEmbed} ref={embedRef}>
          Embed
        </Button>
      )}

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
          {userCanEdit && (
            <MenuItem dense={true} onClick={enableEditorMode}>
              Edit
            </MenuItem>
          )}

          {canShare && (
            <MenuItem dense={true} onClick={openShare}>
              Share
            </MenuItem>
          )}

          {canClone && (
            <MenuItem dense={true} onClick={clone}>
              Clone
            </MenuItem>
          )}

          <MenuItem dense={true} onClick={exportImage}>
            Export
          </MenuItem>

          <MenuItem dense={true} onClick={openDisclaimer}>
            Disclaimer
          </MenuItem>
        </Menu>
      </div>

      <Disclaimer open={showDisclaimer} close={closeDisclaimer} />
      <ShareModal open={showShare} close={closeShare} url={shareUrl} />
      <EmbedForm url={embeddedUrl} open={showEmbed} anchor={embedRef.current} close={closeEmbed} />
    </div>
  )
}
