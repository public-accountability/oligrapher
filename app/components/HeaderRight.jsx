import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import HeaderButtons from './HeaderButtons'
import HeaderMenu from './HeaderMenu'
import Disclaimer from './Disclaimer'
import { userIsOwnerSelector, userCanEditSelector } from '../util/selectors'

export default function HeaderRight() {
  const dispatch = useDispatch()
  const editMode = useSelector(state => state.display.modes.editor)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const userCanEdit = useSelector(userCanEditSelector)
  const user = useSelector(state => state.attributes.user)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const [showModal, setShowModal] = useState(false)

  const enableEditorMode = useCallback(
    () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: true }), 
    [dispatch]
  )

  const clone = useCallback(
    () => dispatch({ type: 'CLONE_REQUESTED' }),
    [dispatch]
  )

  const showDisclaimer = useCallback(() => setShowModal(true), [])
  const hideDisclaimer = useCallback(() => setShowModal(false), [])

  if (userCanEdit && editMode) {
    return <HeaderButtons />
  }

  let headerMenuItems = [
    { text: "Disclaimer", action: showDisclaimer }
  ]

  if (userIsOwner || (user && isCloneable)) {
    headerMenuItems.unshift({ text: "Clone", action: clone })
  }

  if (userCanEdit) {
    headerMenuItems.unshift({ text: "Edit", action: enableEditorMode })
  }

  return (
    <>
      <HeaderMenu items={headerMenuItems} />
      <Disclaimer open={showModal} close={hideDisclaimer} />
    </>
  )
}