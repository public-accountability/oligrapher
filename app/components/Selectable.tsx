import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Selectable({ children }: SelectableProps) {
  const dispatch = useDispatch()
  const setSelecting = useCallback(isSelecting => {
    dispatch({ type: 'SET_SELECTING', isSelecting })
  }, [dispatch])

  useHotkeys('*', evt => {
    if (evt.key === 'Shift') {
      setSelecting(true)
    }
  }, { keydown: true, keyup: false })
  useHotkeys('*', evt => {
    if (evt.key === 'Shift') {
      setSelecting(false)
    }
  }, { keyup: true, keydown: false })

  return (
    <>
      { children }
    </>
  )
}

interface SelectableProps {
  children: JSX.Element
}