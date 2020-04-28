import React from 'react'
import { useDispatch } from 'react-redux'

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
  |------------------------------------------------------------|
*/

export default function Header() {
  const dispatch = useDispatch()
  const { title, subtitle, user, date } = useSelector(state => state.attributes)
  const editMode = useSelector(state => state.display.modes.editor)

  const updateTitle = value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'title', value })
  const updateSubtitle = value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'subtitle', value })

  const PROPS = {
    title: {
      text: title,
      editable: editMode,
      onChange: updateTitle
    },
    subtitle: {
      text: subtitle,
      editable: editMode,
      onChange: updateSubtitle
    },
    attribution: {
      user: user,
      date: date
    }
  }

  return (
   <div id="oligrapher-header">
      <div id="oligrapher-header-top">
        <Title {...PROPS.title} />
      </div>

      <div id="oligrapher-header-bottom">
        <div id="oligrapher-header-left-wrapper">
          <Subtitle {...PROPS.subtitle} />
          <Attribution {...PROPS.attribution} />
        </div>

        <div id="oligrapher-header-right-wrapper">
          <HeaderRight />
        </div>

      </div>
    </div>
  )
}

