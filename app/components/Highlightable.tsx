import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

import { StateWithHistory } from '../util/defaultState'

export default function Highlightable({ children }: HighlightableProps) {
  const dispatch = useDispatch()
  const editMode = useSelector<StateWithHistory>(state => state.display.modes.editor)
  const storyMode = useSelector<StateWithHistory>(state => state.display.modes.story)
  const isEditingAnnotations = editMode && storyMode

  const setHighlighting = useCallback(isHighlighting => {
    dispatch({ type: 'SET_HIGHLIGHTING', isHighlighting })
  }, [dispatch])

  useHotkeys('*', evt => {
    if (isEditingAnnotations && evt.key === 'Control') {
      setHighlighting(true)
    }
  }, { keydown: true, keyup: false }, [isEditingAnnotations])

  useHotkeys('*', evt => {
    if (isEditingAnnotations && evt.key === 'Control') {
      setHighlighting(false)
    }
  }, { keyup: true, keydown: false }, [isEditingAnnotations])

  return (
    <>
      { children }
    </>
  )
}

interface HighlightableProps {
  children: JSX.Element
}