import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Paper } from '@material-ui/core'
import { MdClose } from 'react-icons/md'

export default function HelpTool() {
  const dispatch = useDispatch()
  const closeTool = useCallback(() => dispatch({ type: 'CLOSE_TOOL' }), [dispatch])

  return (
    <Paper id="oligrapher-help" elevation={3}>
      <header>
        User Guide
        <button onClick={closeTool}>
          <MdClose />
        </button>
      </header>
    </Paper>
  )
}