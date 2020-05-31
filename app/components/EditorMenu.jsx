import React from 'react'
import { useSelector } from 'react-redux'

import EditorMenuItem from './EditorMenuItem'
import UndoRedo from './UndoRedo'
import { userIsOwnerSelector } from '../util/selectors'

const MENU_ITEMS = [
  'node',
  'text',
  'style',
  'interlocks',
  'organize',
  'settings',
  'editors',
  'help'
]

export default function EditorMenu() {
  const isOwner = useSelector(userIsOwnerSelector)
  let items = isOwner ? MENU_ITEMS : MENU_ITEMS.filter(i => !['editors', 'settings'].includes(i))

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