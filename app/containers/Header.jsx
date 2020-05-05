import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'

import { useSelector } from '../util/helpers'
import HeaderRight from './HeaderRight'
import Attribution from '../components/Attribution'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'


/*
  |------------------------------------------------------------|
  |  Title (#oligrapher-header-top)                            |
  |------------------------------------------------------------|
  |  #oligrapher-header-bottom                                 |
  |                                                            |
  |                                        One of:             |
  |  Subtitle                              HeaderMenu          |
  |  Attribution                           HeaderButtons       |
  |                                                            |
  |                       size toggler                         |
  |------------------------------------------------------------|
*/

export default function Header() {
  const dispatch = useDispatch()
  const { title, subtitle, user, date } = useSelector(state => state.attributes)
  const editMode = useSelector(state => state.display.modes.editor)
  const [isCollapsed, setCollapsed] = useState(false)

  const updateTitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'title', value }), [])
  const updateSubtitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'subtitle', value }), [])
  const expand = useCallback(() => setCollapsed(false), [])
  const collapse = useCallback(() => setCollapsed(true), [])
  const className = isCollapsed ? "oligrapher-header-collapsed" : "oligrapher-header-expanded"

  return (
   <div id="oligrapher-header" className={className}>
      { isCollapsed || (
        <div id="oligrapher-header-top">
          <Title text={title} editable={editMode} onChange={updateTitle} />
        </div>
      ) }

      <div id="oligrapher-header-bottom">
        { isCollapsed || (
          <div id="oligrapher-header-left-wrapper">
            <Subtitle text={subtitle} editable={editMode} onChange={updateSubtitle} />
            <Attribution user={user} date={date} />
          </div>
        ) }

        <div id="oligrapher-header-right-wrapper">
          <HeaderRight />
        </div>
      </div>

      { editMode &&
        <div id="oligrapher-header-toggler">
          { isCollapsed
            ? <MdExpandMore onClick={expand} />
            : <MdExpandLess onClick={collapse} />
          }
        </div>
      }
    </div>
  )
}

