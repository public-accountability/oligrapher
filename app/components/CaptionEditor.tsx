import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import range from "lodash/range"
import toString from "lodash/toString"

import { useSelector } from "../util/helpers"
import EditorHotKeys from "./EditorHotKeys"
import EditorHeader from "./EditorHeader"
import EditorSubmitButtons from "./EditorSubmitButtons"
import CaptionEditorSelect from "./CaptionEditorSelect"
import { callWithTargetValue } from "../util/helpers"

const FONT_FAMILY_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Monospace", label: "Monospace" },
  { value: "Times New Roman", label: "Times New Roman" },
]

const FONT_WEIGHT_OPTIONS = [
  { value: "400", label: "Normal" },
  { value: "700", label: "Bold" },
]

const FONT_SIZE_OPTIONS = range(8, 31, 2)
  .map(toString)
  .map(i => ({ value: i, label: i }))

type CaptionEditorProps = { id: string }

export default function CaptionEditor({ id }: CaptionEditorProps) {
  const dispatch = useDispatch()
  const caption = useSelector(state => state.graph.captions[id])

  const removeCaption = () => dispatch({ type: "REMOVE_CAPTION", id })

  const onChange = useCallback(
    type => {
      return callWithTargetValue(value =>
        dispatch({ type: "UPDATE_CAPTION", id, attributes: { [type]: value } })
      )
    },
    [dispatch, id]
  )

  return (
    <EditorHotKeys remove={removeCaption}>
      <div className="oligrapher-caption-editor">
        <EditorHeader title="Customize Caption" />
        <main>
          <label>Font</label>
          <br />
          <CaptionEditorSelect
            name="font"
            value={caption.font}
            onChange={onChange}
            options={FONT_FAMILY_OPTIONS}
            width={150}
          />
          <br />
          <CaptionEditorSelect
            name="weight"
            value={caption.weight}
            onChange={onChange}
            options={FONT_WEIGHT_OPTIONS}
            width={100}
          />
          <CaptionEditorSelect
            name="size"
            value={caption.size}
            onChange={onChange}
            options={FONT_SIZE_OPTIONS}
            width={55}
          />
        </main>

        <footer>
          <EditorSubmitButtons hideSubmitButton={true} handleDelete={removeCaption} page="main" />
        </footer>
      </div>
    </EditorHotKeys>
  )
}
