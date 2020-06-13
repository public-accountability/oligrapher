import React from 'react'

import { useSelector } from '../util/helpers'
import HeaderButtons from './HeaderButtons'
import HeaderMenu from './HeaderMenu'
import { userCanEditSelector } from '../util/selectors'

export default function HeaderRight() {
  const editMode = useSelector(state => state.display.modes.editor)
  const userCanEdit = useSelector(userCanEditSelector)

  if (userCanEdit && editMode) {
    return <HeaderButtons />
  } else {
    return <HeaderMenu />
  }
}