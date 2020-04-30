import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { IoIosUndo, IoIosRedo } from 'react-icons/io'

export default function UndoRedo() {
  const dispatch = useDispatch()
  const hasHistory = useSelector(state => state.graph.past.length > 0)
  const hasFuture = useSelector(state => state.graph.future.length > 0)

  const undo = useCallback(() => dispatch(ActionCreators.undo()), [dispatch])
  const redo = useCallback(() => dispatch(ActionCreators.redo()), [dispatch])

  return (
    <div id="oligrapher-undo-redo">
      <button 
        title="Undo" 
        disabled={!hasHistory}
        onClick={undo}>
        <IoIosUndo />
      </button>
      <button 
        title="Redo" 
        disabled={!hasFuture}
        onClick={redo}>
        <IoIosRedo />
      </button>
    </div>
  )
}