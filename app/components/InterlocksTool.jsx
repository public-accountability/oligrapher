import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@mui/material'
import { IoIosLink } from '@react-icons/all-files/io/IoIosLink'

import Toolbox from './Toolbox'
import { isLittleSisId } from '../util/helpers'

export default function InterlocksTool() {
  const dispatch = useDispatch()
  const getInterlocks = useCallback(() => dispatch({ type: 'INTERLOCKS_REQUESTED' }), [dispatch])
  const selectedNodes = useSelector(state => state.display.selection.node)
  const lsNodes = selectedNodes.filter(isLittleSisId)
  const twoLsNodes = selectedNodes.length === 2 && lsNodes.length === 2

  return (
    <Toolbox title="Interlocks">
      <div className="oligrapher-interlocks">
        <p>
          Select two nodes that were imported from LittleSis to fetch their interlocks.
        </p>
        <p>
          If a node was imported from LittleSis, you'll see a <IoIosLink /> icon at the bottom of the form when editing it.
        </p>
        <Button
          disabled={!twoLsNodes}
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
