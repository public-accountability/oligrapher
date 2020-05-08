import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'

import { useSelector } from '../util/helpers'
import HeaderRight from './HeaderRight'
import Attribution from './Attribution'
import Title from './Title'
import Subtitle from './Subtitle'


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
  const { title, subtitle, owner, date } = useSelector(state => state.attributes)
  const editMode = useSelector(state => state.display.modes.editor)
  const isCollapsed = useSelector(state => state.display.headerIsCollapsed)

  const updateTitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'title', value }), [dispatch])
  const updateSubtitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'subtitle', value }), [dispatch])
  const expand = useCallback(() => dispatch({ type: 'EXPAND_HEADER' }), [dispatch])
  const collapse = useCallback(() => dispatch({ type: 'COLLAPSE_HEADER' }), [dispatch])
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
            { owner && <Attribution user={owner} date={date} /> }
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

