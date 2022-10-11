import React, { useState } from "react"
import Box from "@mui/material/Box"
import Input from "@mui/material/Input"
import { getDataUrl } from "../datasources/littlesis3"
import { useDispatch } from "react-redux"

const isDataUrl = (str: string) => str && str.slice(0, 5) === "data:"

const isLittleSisImage = (str: string) => str && str.slice(0, 28) === "https://littlesis.org/images"

const isHttpUrl = (str: string) => str && /https?:\/\/.*/.test(str)

type StatusType = null | "requestStarted" | "foundDataurl" | "invalidUrl" | "noDataurl"

type NodeEditorImagePropTypes = {
  image: string | null
  id: string
}

const messages = {
  invalidUrl: "This url is invalid",
  nodataUrl: "Failed to save remote image",
}

export default function NodeEditorImage(props: NodeEditorImagePropTypes) {
  const dispatch = useDispatch()
  const [image, setImage] = useState<string>(props.image)
  const [status, setStatus] = useState<StatusType>(null)

  const handleSubmit: React.MouseEventHandler = async _ => {
    if (isDataUrl(image) || isLittleSisImage(image)) {
      setStatus(null)
      dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: image } })
    } else if (isHttpUrl(image)) {
      setStatus("requestStarted")
      const dataurl = await getDataUrl(image)
      if (dataurl.dataurl) {
        dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: dataurl.dataurl } })
        setStatus("foundDataUrl")
      } else {
        // what to do in this situation?
        // dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: image } })
        setStatus("noDataurl")
      }
    } else {
      // dispatch({ type: "UPDATE_NODE", id: props.id, attributes: { image: image } })
      setStatus("invalidUrl")
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Input
        type="text"
        value={props.image}
        onChange={event => setImage(event.target.value)}
      ></Input>

      <Box></Box>

      <button>Set</button>
    </Box>
  )
}
