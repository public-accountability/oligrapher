import React from "react"
import { useDispatch } from "react-redux"
import IconButton from "@mui/material/IconButton"
import { MdAddCircle, MdSelectAll } from "react-icons/md"

export default function InterlocksActionButton({ interlocksState }) {
  const dispatch = useDispatch()

  const selectPreviousBatch =
    interlocksState.previousNodes &&
    interlocksState.previousNodes.length > 0 &&
    interlocksState.nodes === null

  if (selectPreviousBatch) {
    return (
      <IconButton
        aria-label="select added nodes"
        onClick={() => dispatch({ type: "SELECT_PREVIOUS_INTERLOCKS" })}
      >
        <MdSelectAll />
      </IconButton>
    )
  } else {
    return (
      <IconButton
        aria-label="add all to map"
        disabled={interlocksState.nodes === null || interlocksState.nodes.length === 0}
        onClick={() => dispatch({ type: "ADD_ALL_INTERLOCKS" })}
      >
        <MdAddCircle />
      </IconButton>
    )
  }
}
