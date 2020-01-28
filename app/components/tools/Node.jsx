import React, { useState  } from 'react'
import { useDispatch } from 'react-redux'

import EntitySearch from './EntitySearch'
import Toolbox from './Toolbox'

const doSearch = searchValue => Boolean(searchValue) && searchValue.length > 2

export default function NodeTool() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const onSearch = event => setSearchValue(event.target.value)

  const onClickCreateNew = () => {
    const name = searchValue.trim()

    if (name) {
      dispatch({ type: 'ADD_NODE', attributes: { name } })
    } else {
      // TODO move this error handling to the reducer?
      console.error("Node name is blank.")
    }
  }

  return <Toolbox title="Add Node">
           <div className="nodetool">
             <input type="text"
                    placeholder="Search database"
                    value={searchValue}
                    onChange={onSearch} />

             <a onClick={onClickCreateNew}>Create New +</a>

             <div>
               { doSearch(searchValue) && <EntitySearch query={searchValue} />}
             </div>
           </div>
         </Toolbox>
}
