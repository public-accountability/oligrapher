import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import noop from 'lodash/noop'

import HeaderButtons from '../components/HeaderButtons'
import HeaderMenu from '../components/HeaderMenu'

export function HeaderRight(props) {
  if (props.editorMode) {
    return <HeaderButtons saveAction={noop} discardAction={props.disableEditorMode} />
  } else {

    const headerMenuItems = [
      { text: "edit", action: props.enableEditorMode},
      { text: "Clone", url: "https://littlesis.org/oligrapher/clone" },
      { text: "Disclaimer", url: "https://littlesis.org/oligrapher/disclaimer" }
    ]

    return <HeaderMenu items={headerMenuItems} />
  }
}

HeaderRight.propTypes = {
  enableEditorMode: PropTypes.func.isRequired,
  disableEditorMode: PropTypes.func.isRequired,
  editorMode: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({ editorMode: state.display.modes.editor })

const mapDispatchToProps = dispatch => {
  return {
    enableEditorMode: () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: true}),
    disableEditorMode: () => dispatch({ type: 'SET_MODE', mode: 'editor', enabled: false})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderRight)
