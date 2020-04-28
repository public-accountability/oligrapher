import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import HeaderButtons from './HeaderButtons'
import HeaderMenu from '../components/HeaderMenu'

export default function HeaderRight() {
  const dispatch = useDispatch()
  const editMode = useSelector(state => state.display.modes.editor)

  const enableEditorMode = () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: true })

  if (editMode) {
    return <HeaderButtons />
  } else {

    const headerMenuItems = [
      { text: "Edit", action: enableEditorMode },
      { text: "Clone", url: "https://littlesis.org/oligrapher/clone" },
      { text: "Disclaimer", url: "https://littlesis.org/oligrapher/disclaimer" }
    ]

    return <HeaderMenu items={headerMenuItems} />
  }
}