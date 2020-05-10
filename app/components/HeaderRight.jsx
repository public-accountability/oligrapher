import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import HeaderButtons from './HeaderButtons'
import HeaderMenu from './HeaderMenu'
import { userIsOwnerSelector } from '../util/selectors'

export default function HeaderRight() {
  const dispatch = useDispatch()
  const editMode = useSelector(state => state.display.modes.editor)
  const userIsOwner = useSelector(userIsOwnerSelector)
  const user = useSelector(state => state.attributes.user)
  const isCloneable = useSelector(state => state.attributes.settings.clone)

  const enableEditorMode = useCallback(
    () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: true }), 
    [dispatch]
  )

  const clone = useCallback(
    () => dispatch({ type: 'CLONE_REQUESTED' }),
    [dispatch]
  )

  if (userIsOwner && editMode) {
    return <HeaderButtons />
  }

  let headerMenuItems = [
    { text: "Disclaimer", url: "https://littlesis.org/oligrapher/disclaimer" }
  ]

  if (userIsOwner || (user && isCloneable)) {
    headerMenuItems.unshift({ text: "Clone", action: clone })
  }

  if (userIsOwner) {
    headerMenuItems.unshift({ text: "Edit", action: enableEditorMode })
  }

  return <HeaderMenu items={headerMenuItems} />
}