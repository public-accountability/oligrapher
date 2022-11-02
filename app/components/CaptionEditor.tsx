import React from "react"
import { useDispatch } from "react-redux"
import range from "lodash/range"
import toString from "lodash/toString"
import Box from "@mui/material/Box"
import { useSelector } from "../util/helpers"
import EditorHeader from "./EditorHeader"
import EditorSubmitButtons from "./EditorSubmitButtons"
import CaptionEditorSelect from "./CaptionEditorSelect"
import { useHotkeys } from "react-hotkeys-hook"

const OPTIONS = {
  fontFamily: [
    { value: "Arial", label: "Arial" },
    { value: "Monospace", label: "Monospace" },
    { value: "Times New Roman", label: "Times New Roman" },
  ],
  weight: [
    { value: "400", label: "Normal" },
    { value: "700", label: "Bold" },
  ],
  fontSize: range(8, 31, 2)
    .map(toString)
    .map(i => ({ value: i, label: i })),
}

type CaptionEditorProps = { id: string }

export default function CaptionEditor({ id }: CaptionEditorProps) {
  const dispatch = useDispatch()
  const caption = useSelector(state => state.graph.captions[id])
  const removeCaption = () => dispatch({ type: "REMOVE_CAPTION", id })

  const createOnChangeHandler =
    (attributeName: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: "UPDATE_CAPTION", id, attributes: { [attributeName]: event.target.value } })
    }

  useHotkeys("escape", () => {
    dispatch({ type: "CLOSE_EDITOR" })
  })

  useHotkeys("del", removeCaption)

  return (
    <div className="oligrapher-caption-editor" data-testid="oligrapher-caption-editor">
      <EditorHeader title="Customize Caption" />

      <Box sx={{ mt: "10px" }}>
        <CaptionEditorSelect
          name="font"
          title="Font"
          value={caption.font}
          onChange={createOnChangeHandler("font")}
          options={OPTIONS.fontFamily}
        />
      </Box>

      <Box>
        <CaptionEditorSelect
          name="weight"
          value={caption.weight}
          onChange={createOnChangeHandler("weight")}
          options={OPTIONS.weight}
        />
      </Box>

      <Box>
        <CaptionEditorSelect
          name="size"
          value={caption.size}
          onChange={createOnChangeHandler("size")}
          options={OPTIONS.fontSize}
        />
      </Box>

      <Box>
        <EditorSubmitButtons hideSubmitButton={true} handleDelete={removeCaption} page="main" />
      </Box>
    </div>
  )
}
