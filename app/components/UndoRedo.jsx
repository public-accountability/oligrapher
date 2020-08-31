import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { IoIosUndo, IoIosRedo } from 'react-icons/io'

export default function UndoRedo() {
  const dispatch = useDispatch()
  const past = useSelector(state => state.graph.past)
  const future = useSelector(state => state.graph.future)

  // we close any floating editor in case our undo or redo
  // removes a graph item that's currently being edited
  const undo = useCallback(() =>  {
    dispatch({ type: 'CLOSE_EDITOR' })
    dispatch(ActionCreators.undo())
  }, [dispatch])

  const redo = useCallback(() => { 
    dispatch({ type: 'CLOSE_EDITOR' })
    dispatch(ActionCreators.redo())
  }, [dispatch])

  if (!past || !future) {
    return null
  }

  return (
    <div id="oligrapher-undo-redo">
      <button 
        title="Undo" 
        disabled={past.length === 0}
        onClick={undo}>
        <IoIosUndo />
      </button>
      <button 
        title="Redo" 
        disabled={future.length === 0}
        onClick={redo}>
        <IoIosRedo />
      </button>
    </div>
  )
}