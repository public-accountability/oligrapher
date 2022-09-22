import React from 'react'
import { useSelector } from 'react-redux'
import useMediaQuery from '@mui/material/useMediaQuery'

import EditorMenuItem from './EditorMenuItem'
import UndoRedo from './UndoRedo'
import { userIsOwnerSelector } from '../util/selectors'

const MENU_ITEMS = [
  'node',
  'text',
  'style',
  'interlocks',
  'annotations',
//  'organize',
  'settings',
  'editors',
  'help'
]

export default function EditorMenu() {
  const currentTool = useSelector(state => state.display.tool)
  const isSaved = useSelector(state => state.attributes.id)
  const isOwner = useSelector(userIsOwnerSelector)
  const screenIsSmall = useMediaQuery(theme => theme.breakpoints.down('sm'))
  let items = isOwner ? MENU_ITEMS : MENU_ITEMS.filter(item => !['editors', 'settings'].includes(item))
  items = isSaved ? items : items.filter(item => item !== 'editors')


  return (
    <div className="editor-menu">
      { items.map(item => (
        <EditorMenuItem
          key={item}
          item={item}
          inUse={item === currentTool}
          disabled={screenIsSmall && item === 'annotations'} />
      )) }
      <UndoRedo />
    </div>
  )
}
