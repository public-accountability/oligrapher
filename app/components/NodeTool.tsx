import React, { useState } from "react"
import { useDispatch } from "react-redux"
import Input from "@mui/material/Input"

import { useClientRect } from "../util/helpers"
import EntitySearch from "./EntitySearch"
import Toolbox from "./Toolbox"

export default function NodeTool() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState("")
  const [maxHeight, setMaxHeight] = useState(0)
  const trimmed = searchValue.trim()
  const doSearch = trimmed.length > 2

  const onClickCreateNew = () => {
    dispatch({ type: "ADD_NODE", node: { name: trimmed } })
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
        <Input
          autoFocus
          type="text"
          placeholder="Search database"
          disableUnderline={true}
          value={searchValue}
          onChange={event => setSearchValue(event.target.value)}
          data-testid="add-node-input"
        />

        {doSearch && (
          <div>
            Select below or <a onClick={onClickCreateNew}>create new node</a>
            <hr />
            <EntitySearch query={trimmed} maxHeight={maxHeight} />
          </div>
        )}
      </div>
    </Toolbox>
  )
}
