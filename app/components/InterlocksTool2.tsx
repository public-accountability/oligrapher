import React from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "@mui/material/Button"
import { IoIosLink } from "react-icons/io"

import Toolbox from "./Toolbox"
import InterlocksNodeList from "./InterlocksNodeList"
import { isLittleSisId } from "../util/helpers"
import { interlocksStateSelector } from "../util/selectors"

export default function InterlocksTool2() {
  const dispatch = useDispatch()
  const lsNodes = useSelector(state => state.display.selection.node.filter(isLittleSisId))
  const interlocksState = useSelector(interlocksStateSelector)
  const buttonDisabled = !!interlocksState.status || lsNodes.length < 2

  return (
    <Toolbox title="Interlocks2">
      <div className="oligrapher-interlocks">
        <p>
          Select nodes that were imported from LittleSis <IoIosLink /> to fetch their interlocks.
        </p>
        <p>
          LittleSis Nodes Selected: <code>{lsNodes.length}</code>
        </p>
        <Button
          disabled={buttonDisabled}
          onClick={() => dispatch({ type: "INTERLOCKS_REQUESTED_2", selectedNodes: lsNodes })}
          variant="contained"
          color="primary"
          disableElevation={true}
        >
          Get interlocks
        </Button>
        {interlocksState.nodes && <InterlocksNodeList nodes={interlocksState.nodes} />}
      </div>
    </Toolbox>
  )
}
