import React, { useState } from "react"
import Box from "@mui/material/Box"
import LoadingButton from "@mui/lab/LoadingButton"
import TextField from "@mui/material/TextField"
import { useDispatch } from "react-redux"

import { getDataUrl } from "../datasources/littlesis"

const isDataUrl = (str: string) => str && str.slice(0, 5) === "data:"

const isLittleSisImage = (str: string) => str && str.slice(0, 28) === "https://littlesis.org/images"

const isHttpUrl = (str: string) => str && /https?:\/\/.*/.test(str)

type StatusType =
  | null
  | "requestStarted"
  | "foundDataurl"
  | "invalidUrl"
  | "noDataurl"
  | "requestFailed"

type NodeEditorImagePropTypes = {
  image: null | undefined | string
  id: string
}

const messages = {
  invalidUrl: "This url is invalid",
  requestFailed: "Remote request failed",
  noDataurl: "Failed to save remote image",
}

export default function NodeEditorImage(props: NodeEditorImagePropTypes) {
  const dispatch = useDispatch()
  const [image, setImage] = useState<string>(props.image)
  const [status, setStatus] = useState<StatusType>(null)

  const handleSubmit: React.MouseEventHandler = async _ => {
    if (!image) {
      setStatus(null)
      dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: null } })
    } else if (isDataUrl(image) || isLittleSisImage(image)) {
      setStatus(null)
      dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: image } })
    } else if (isHttpUrl(image)) {
      setStatus("requestStarted")

      let dataurl

      try {
        dataurl = await getDataUrl(image)
      } catch (error) {
        console.error(error)
        setStatus("requestFailed")
        return
      }

      if (dataurl.dataurl) {
        dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: dataurl.dataurl } })
        setImage(dataurl.dataurl)
        setStatus("foundDataUrl")
      } else {
        // what to do in this situation?
        setStatus("noDataurl")
      }
    } else {
      // dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: image } })
      setStatus("invalidUrl")
    }
  }

  const error = ["noDataurl", "invalidUrl", "requestFailed"].includes(status)
  const helperText = error ? messages[status] : " "
  const label = error ? "Error" : "Image URL or data"

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        variant="standard"
        onChange={event => setImage(event.target.value)}
        value={image}
        error={error}
        label={label}
        helperText={helperText}
      />
      <LoadingButton
        variant="contained"
        onClick={handleSubmit}
        loading={status === "requestStarted"}
      >
        Update
      </LoadingButton>
    </Box>
  )
}
