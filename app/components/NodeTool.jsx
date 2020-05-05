import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Node from '../graph/node'
import { callWithTargetValue } from '../util/helpers'
import EntitySearch from './EntitySearch'
import Toolbox from './Toolbox'

export default function NodeTool() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const trimmed = searchValue.trim()
  const doSearch = trimmed.length > 2
  const handleInputChange = callWithTargetValue(setSearchValue)

  const onClickCreateNew = () => {
    dispatch({ type: 'ADD_NODE', node: Node.new({ name: trimmed }) })
  }

  return (
    <Toolbox title="Add Node">
      <div className="node-tool">
        <input
          autoFocus
          type="text"
          placeholder="Search database"
          value={searchValue}
          onChange={handleInputChange} />

        { doSearch && 
          <div>
            Select below or <a onClick={onClickCreateNew}>create new node</a>
            <hr />
            <EntitySearch query={trimmed} />
          </div>
        }
      </div>
    </Toolbox>
  )
}