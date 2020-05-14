import React from 'react'
import { useSelector } from 'react-redux'

import { MENU_ITEMS } from '../editorMenu'
import EditorMenuItem from './EditorMenuItem'
import UndoRedo from './UndoRedo'
import { userIsOwnerSelector } from '../util/selectors'

export default function EditorMenu() {
  const isOwner = useSelector(userIsOwnerSelector)
  const items = isOwner ? MENU_ITEMS : MENU_ITEMS.filter(i => i !== 'editors')

  return (
    <div className="editor-menu">
      { items.map(item => (
        <EditorMenuItem
          key={item}
          item={item} />
      )) }
      <UndoRedo />
    </div>
  )
}