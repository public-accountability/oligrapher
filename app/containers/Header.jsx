import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import HeaderRight from './HeaderRight'
import Attribution from '../components/Attribution'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'

/*
  |------------------------------------------------------------|
  |  Title (#oligrapher-header-top)                            |                                  |
  |------------------------------------------------------------|
  | #oligrapher-header-bottom
  |
  |                                      One of:               |
  |  Subtitle                              HeaderMenu          |
  |  Attribution                           HeaderButtons       |
  |------------------------------------------------------------|
*/

export function Header(props) {
  const divRef = useRef()

  useEffect(() => {
    const height = divRef.current.getBoundingClientRect().height
    props.setHeaderHeight(Math.ceil(height))
  }, [props])

  const PROPS = {
    title: {
      text: props.title,
      editable: props.editMode,
      onChange: props.updateTitle
    },
    subtitle: {
      text: props.subtitle,
      editable: props.editMode,
      onChange: props.updateSubtitle
    },
    attribution: {
      user: props.user,
      date: props.date
    }
  }

  return (
   <div id="oligrapher-header" ref={divRef}>
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

Header.propTypes = {
  editMode: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  date: PropTypes.string,
  user: PropTypes.shape({ name: PropTypes.string, url: PropTypes.string }),
  updateTitle: PropTypes.func.isRequired,
  updateSubtitle: PropTypes.func.isRequired,
  setHeaderHeight: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  editMode: Boolean(state.display.modes.editor),
  title: state.attributes.title,
  subtitle: state.attributes.subtitle,
  user: state.attributes.user,
  date: state.attributes.date
})

const mapDispatchToProps = dispatch => ({
  updateTitle: value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'title', value: value }),
  updateSubtitle: value => dispatch({ type: 'UPDATE_ATTRIBUTE', name: 'subtitle', value: value }),
  setHeaderHeight: height => dispatch({ type: 'SET_HEADER_HEIGHT', height })
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
