import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { MdExpandMore } from '@react-icons/all-files/md/MdExpandMore'
import { MdExpandLess } from '@react-icons/all-files/md/MdExpandLess'
import useMediaQuery from '@mui/material/useMediaQuery'

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
  |  Subtitle                              HeaderActions       |
  |  Attribution                           HeaderEditActions   |
  |                                                            |
  |                       size toggler                         |
  |------------------------------------------------------------|
*/

export default function Header() {
  const dispatch = useDispatch()
  const { title, subtitle, owner, editors, date } = useSelector(state => state.attributes)
  const editMode = useSelector(state => state.display.modes.editor)
  const isCollapsed = useSelector(state => state.display.headerIsCollapsed)

  const updateTitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'title', value }), [dispatch])
  const updateSubtitle = useCallback(value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'subtitle', value }), [dispatch])
  const expand = useCallback(() => dispatch({ type: 'EXPAND_HEADER' }), [dispatch])
  const collapse = useCallback(() => dispatch({ type: 'COLLAPSE_HEADER' }), [dispatch])
  const className = editMode ? (isCollapsed ? "oligrapher-header-collapsed" : "oligrapher-header-expanded") : ""
  const users = [owner].concat(editors.filter(e => !e.pending))

  const screenIsSmall = useMediaQuery(theme => theme.breakpoints.down('xs'))
  const hideAttribution = !editMode && screenIsSmall

  const divRef = useRef()

  useEffect(() => {
    dispatch({ type: 'SET_SVG_TOP', svgTop: divRef.current.getBoundingClientRect().bottom })
  }, [dispatch, isCollapsed])

  return (
    <div id="oligrapher-header" className={className} ref={divRef}>
      { isCollapsed &&
        <div id="oligrapher-header-bottom" className={editMode ? "editing" : ""}>
          <Title text={title} editable={false} />

          <div id="oligrapher-header-right-wrapper">
            <HeaderRight />
          </div>
        </div>
      }

      { !isCollapsed &&
        <>
          <div id="oligrapher-header-top">
            <Title text={title} editable={editMode} onChange={updateTitle} />
            <Subtitle text={subtitle} editable={editMode} onChange={updateSubtitle} />
          </div>

          <div id="oligrapher-header-bottom" className={editMode ? "editing" : ""}>
            <div id="oligrapher-header-left-wrapper">
              { !hideAttribution && owner && <Attribution users={users} date={date} /> }
            </div>

            <div id="oligrapher-header-right-wrapper">
              <HeaderRight />
            </div>
          </div>
        </>
      }

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
