import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { callWithTargetValue } from '../../util/helpers'

import EntitySearch from './EntitySearch'
import Toolbox from './Toolbox'

export default function NodeTool() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const trimmed = searchValue.trim()
  const doSearch = trimmed.length > 2
  const handleInputChange = callWithTargetValue(setSearchValue)

  const onClickCreateNew = () => {
    dispatch({ type: 'ADD_NODE', attributes: { name: trimmed } })
  }

  return (
    <Toolbox title="Add Node">
      <div className="nodetool">
        <input type="text"
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