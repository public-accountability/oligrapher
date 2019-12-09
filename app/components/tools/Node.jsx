import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

export default function NodeTool(props) {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')


  const onSearch = event => setSearchValue(event.target.value)

  const onClickCreateNew = (_) => {
    const name = searchValue.trim()

    if (name) {
      dispatch({ type: 'ADD_NODE', attributes: { name } })
    } else {
      console.error("Node name is blank.")
    }
  }

  return <div className="nodetool">
           <input type="text"
                  placeholder="Search database"
                  value={searchValue}
                  onChange={onSearch} />

           <a onClick={onClickCreateNew}>Create New +</a>
         </div>


}
