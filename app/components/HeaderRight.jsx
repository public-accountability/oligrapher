import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import HeaderButtons from './HeaderButtons'
import HeaderMenu from './HeaderMenu'
import Disclaimer from './Disclaimer'
import ShareModal from './ShareModal'
import { userIsOwnerSelector, userCanEditSelector } from '../util/selectors'

export default function HeaderRight() {
  const dispatch = useDispatch()
  const editMode = useSelector(state => state.display.modes.editor)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const userCanEdit = useSelector(userCanEditSelector)
  const user = useSelector(state => state.attributes.user)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const isPrivate = useSelector(state => state.attributes.settings.private)
  const shareUrl = useSelector(state => state.attributes.shareUrl)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const enableEditorMode = useCallback(
    () => dispatch({ type: 'SET_EDITOR_MODE', enabled: true }), 
    [dispatch]
  )

  const clone = useCallback(
    () => dispatch({ type: 'CLONE_REQUESTED' }),
    [dispatch]
  )
  
  const openShare = useCallback(() => setShowShare(true), [])
  const closeShare = useCallback(() => setShowShare(false), [])

  const openDisclaimer = useCallback(() => setShowDisclaimer(true), [])
  const closeDisclaimer = useCallback(() => setShowDisclaimer(false), [])

  if (userCanEdit && editMode) {
    return <HeaderButtons />
  }

  let headerMenuItems = [
    { text: "Disclaimer", action: openDisclaimer }
  ]

  if (userIsOwner || (user && isCloneable)) {
    headerMenuItems.unshift({ text: "Clone", action: clone })
  }

  if (userIsOwner && isPrivate && shareUrl) {
    headerMenuItems.unshift({ text: 'Share', action: openShare })
  }

  if (userCanEdit) {
    headerMenuItems.unshift({ text: "Edit", action: enableEditorMode })
  }

  return (
    <>
      <HeaderMenu items={headerMenuItems} />
      <Disclaimer open={showDisclaimer} close={closeDisclaimer} />
      <ShareModal open={showShare} close={closeShare} url={shareUrl} />
    </>
  )
}