import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "@mui/material/Button"
import { IoIosLink } from "react-icons/io"

import Toolbox from "./Toolbox"
import InterlocksNodeList from "./InterlocksNodeList"
import { interlocksStateSelector, selectedLsNodesSelector } from "../util/selectors"
import { useClientRect } from "../util/helpers"
import InterlocksActionButton from "./InterlocksActionButton"

export default function InterlocksTool2() {
  const dispatch = useDispatch()
  const lsNodes = useSelector(selectedLsNodesSelector)
  const interlocksState = useSelector(interlocksStateSelector)
  const buttonDisabled = !!interlocksState.status || lsNodes.length < 2
  const [maxHeight, setMaxHeight] = useState<number>(600)

  const nodeListContainer = useClientRect(rect => {
    if (!rect) {
      return
    }

    const { bottom, height } = rect
    const diff = bottom - window.innerHeight
    setMaxHeight(height - diff - 100)
  })

  return (
    <Toolbox title="Interlocks">
      <div className="oligrapher-interlocks">
        <div>
          <p>
            Select nodes that were imported from LittleSis <IoIosLink /> to fetch their interlocks.
          </p>
          <p>
            LittleSis Nodes Selected: <code>{lsNodes.length}</code>
          </p>

          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Button
              disabled={buttonDisabled}
              onClick={() => dispatch({ type: "INTERLOCKS_REQUESTED_2", selectedNodes: lsNodes })}
              variant="contained"
              color="primary"
              disableElevation={true}
            >
              Get interlocks
            </Button>
            <InterlocksActionButton interlocksState={interlocksState} />
          </div>
        </div>

        <div ref={nodeListContainer} style={{ overflow: "auto", maxHeight: `${maxHeight}px` }}>
          {interlocksState.nodes && <InterlocksNodeList nodes={interlocksState.nodes} />}
        </div>
      </div>
    </Toolbox>
  )
}
