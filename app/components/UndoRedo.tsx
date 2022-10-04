import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosUndo } from '@react-icons/all-files/io/IoIosUndo'
import { IoIosRedo } from '@react-icons/all-files/io/IoIosRedo'
import { futureHistorySelector, pastHistorySelector } from '../util/selectors'

export default function UndoRedo() {
  const dispatch = useDispatch()
  const past = useSelector(pastHistorySelector)
  const future = useSelector(futureHistorySelector)

  const undo = () => dispatch({ type: 'HISTORY_UNDO' })
  const redo = () => dispatch({ type: 'HISTORY_REDO' })

  return (
    <div id="oligrapher-undo-redo">
      <button title="Undo" disabled={past.length === 0} onClick={undo}>
        <IoIosUndo />
      </button>
      <button title="Redo" disabled={future.length === 0} onClick={redo}>
        <IoIosRedo />
      </button>
    </div>
  )
}
