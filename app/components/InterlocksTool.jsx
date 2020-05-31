import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'

import Toolbox from './Toolbox'

export default function InterlocksTool() {
  const dispatch = useDispatch()
  const getInterlocks = useCallback(() => dispatch({ type: 'INTERLOCKS_REQUESTED' }), [dispatch])
  const selectedCount = useSelector(state => state.display.selection.node.length)

  return (
    <Toolbox title="Interlocks">
      <div className="oligrapher-interlocks">
        Select two nodes to find interlocks between them.
        <br />
        <br />
        <Button 
          disabled={selectedCount !== 2} 
          onClick={getInterlocks} 
          variant="contained" 
          color="primary"
          disableElevation={true}
        >
          Get interlocks
        </Button>
      </div>
    </Toolbox>
  )
}