import React from 'react'

import { useSelector } from '../util/helpers'
import HeaderEditActions from './HeaderEditActions'
import HeaderActions from './HeaderActions'
import { userCanEditSelector } from '../util/selectors'

export default function HeaderRight() {
  const editMode = useSelector(state => state.display.modes.editor)
  const userCanEdit = useSelector(userCanEditSelector)

  if (userCanEdit && editMode) {
    return <HeaderEditActions />
  } else {
    return <HeaderActions />
  }
}