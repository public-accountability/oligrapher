import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { MdUndo, MdRedo } from 'react-icons/md'

export default function UndoRedo() {
  const dispatch = useDispatch()
  const hasHistory = useSelector(state => state.past.length > 0)
  const hasFuture = useSelector(state => state.future.length > 0)

  const undo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch])
  const redo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch])

  return (
    <div id="oligrapher-undo-redo">
      <button 
        title="undo" 
        disabled={!hasHistory}
        onClick={undo}>
        <MdUndo />
      </button>
      <button 
        title="redo" 
        disabled={!hasFuture}
        onClick={redo}>
        <MdRedo />
      </button>
    </div>
  )
}