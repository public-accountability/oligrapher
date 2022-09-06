import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Node from '../graph/node'
import { callWithTargetValue } from '../util/helpers'
import EntitySearch from './EntitySearch'
import Toolbox from './Toolbox'
import { useClientRect } from '../util/helpers'

export default function NodeTool() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [maxHeight, setMaxHeight] = useState()
  const trimmed = searchValue.trim()
  const doSearch = trimmed.length > 2
  const handleInputChange = callWithTargetValue(setSearchValue)

  const onClickCreateNew = () => {
    dispatch({ type: 'ADD_NODE', node: Node.new({ name: trimmed }) })
  }

  // fit node tool within visible window
  const ref = useClientRect(rect => {
    if (!rect) {
      return
    }

    const { bottom, height } = rect
    const diff = bottom - window.innerHeight
    setMaxHeight(height - diff - 100)
  })

  return (
    <Toolbox title="Add Node">
      <div className="node-tool" ref={ref}>
        <input
          autoFocus
          type="text"
          placeholder="Search database"
          value={searchValue}
          onChange={handleInputChange}
          data-testid="add-node-input"
        />

        { doSearch &&
          <div>
            Select below or <a onClick={onClickCreateNew}>create new node</a>
            <hr />
            <EntitySearch query={trimmed} maxHeight={maxHeight} />
          </div>
        }
      </div>
    </Toolbox>
  )
}
