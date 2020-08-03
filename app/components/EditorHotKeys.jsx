import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'
import noop from 'lodash/noop'

import { eventTargetIsFormElement } from '../util/helpers'

export default function EditorHotKeys({ children, remove }) {
  const dispatch = useDispatch()
  const closeEditor = useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), [dispatch])

  useHotkeys('escape', closeEditor)
  useHotkeys('backspace, del', event => {
    if (!eventTargetIsFormElement(event)) {
      remove(event)
    }
  }, null, [remove])

  return (
    <>
      { children }
    </>
  )
}

EditorHotKeys.propTypes = {
  children: PropTypes.node.isRequired,
  remove: PropTypes.func
}

EditorHotKeys.defaultProps = {
  remove: noop
}