import React from "react"
import { useDispatch } from "react-redux"
import range from "lodash/range"
import toString from "lodash/toString"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Stack from "@mui/material/Stack"
import { useSelector } from "../util/helpers"
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
    dispatch({ type: "TOGGLE_CAPTION_EDITOR", id })
  })

  useHotkeys("del", removeCaption)

  return (
    <div className="oligrapher-caption-editor" data-testid="oligrapher-caption-editor">
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Text"
          multiline
          rows={4}
          value={caption.text}
          onChange={createOnChangeHandler("text")}
          variant="filled"
        />
      </Box>

      <Box>
        <Stack spacing={2} sx={{ mr: 1 }}>
          <CaptionEditorSelect
            name="font"
            title="Font"
            value={caption.font}
            onChange={createOnChangeHandler("font")}
            options={OPTIONS.fontFamily}
          />
          <CaptionEditorSelect
            name="weight"
            value={caption.weight}
            onChange={createOnChangeHandler("weight")}
            options={OPTIONS.weight}
          />
          <CaptionEditorSelect
            name="size"
            value={caption.size}
            onChange={createOnChangeHandler("size")}
            options={OPTIONS.fontSize}
          />
        </Stack>
      </Box>

      <Box sx={{ mt: 2, mb: 1 }}>
        <Button onClick={removeCaption} variant="contained" color="secondary" size="small">
          Delete
        </Button>
      </Box>
    </div>
  )
}
