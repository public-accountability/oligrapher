import React, { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { MdExpandMore, MdExpandLess } from "react-icons/md"
import useMediaQuery from "@mui/material/useMediaQuery"

import { useSelector } from "../util/helpers"
import HeaderRight from "./HeaderRight"
import Attribution from "./Attribution"
import Title from "./Title"
import Subtitle from "./Subtitle"
import { editModeSelector, headerIsCollapsedSelector } from "../util/selectors"
import { State } from "../util/defaultState"

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
  const smallScreen = useMediaQuery("(max-height:600px)")

  const editMode = useSelector(editModeSelector)
  const { title, subtitle, owner, editors, date } = useSelector<State, AttributesState>(
    state => state.attributes
  )
  const isCollapsed = useSelector(headerIsCollapsedSelector)
  const { embed, url } = useSelector<State>(state => state.settings)

  const dispatch = useDispatch()
  const updateTitle = (value: string) =>
    dispatch({ type: "UPDATE_ATTRIBUTE", name: "title", value })
  const updateSubtitle = (value: string) =>
    dispatch({ type: "UPDATE_ATTRIBUTE", name: "subtitle", value })
  const expand = () => dispatch({ type: "EXPAND_HEADER" })
  const collapse = () => dispatch({ type: "COLLAPSE_HEADER" })

  const className = editMode
    ? isCollapsed
      ? "oligrapher-header-collapsed"
      : "oligrapher-header-expanded"
    : ""
  const users = [owner].concat(editors.filter(e => !e.pending))

  const hideAttribution = !editMode && smallScreen

  // Use the normal header while editing or if the screen is large enough
  const showNormalHeader = editMode || !smallScreen
  const showCondensedHeader = !showNormalHeader

  // const divRef = useRef()

  if (showCondensedHeader) {
    return (
      <div id="oligrapher-header-condensed">
        <Title text={title} editable={false} url={embed && url} />
      </div>
    )
  }

  return (
    <div id="oligrapher-header" className={className}>
      {isCollapsed && (
        <div id="oligrapher-header-bottom" className={editMode ? "editing" : ""}>
          <Title text={title} editable={false} />

          <div id="oligrapher-header-right-wrapper">
            <HeaderRight />
          </div>
        </div>
      )}

      {!isCollapsed && (
        <>
          <div id="oligrapher-header-top">
            <Title text={title} editable={editMode} onChange={updateTitle} />
            <Subtitle text={subtitle} editable={editMode} onChange={updateSubtitle} />
          </div>

          <div id="oligrapher-header-bottom" className={editMode ? "editing" : ""}>
            <div id="oligrapher-header-left-wrapper">
              {!hideAttribution && owner && <Attribution users={users} date={date} />}
            </div>

            <div id="oligrapher-header-right-wrapper">
              <HeaderRight />
            </div>
          </div>
        </>
      )}

      {editMode && (
        <div id="oligrapher-header-toggler" data-testid="oligrapher-header-toggler">
          {isCollapsed ? <MdExpandMore onClick={expand} /> : <MdExpandLess onClick={collapse} />}
        </div>
      )}
    </div>
  )
}
