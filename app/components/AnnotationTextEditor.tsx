import React, { useCallback } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

const nullifyIfEmpty = (s: string): string | null => (s === "" ? null : s)

type AnnotationTextEditorPropTypes = {
  text: string
  onChange: (event: React.ChangeEvent, editor: CKEditor) => void
}

export default function AnnotationTextEditor({ text, onChange }: AnnotationTextEditorPropTypes) {
  const handleChange = useCallback(
    (event, editor) => {
      onChange(nullifyIfEmpty(editor.getData()))
    },
    [onChange]
  )

  const config = {
    placeholder: "Annotation text",
    toolbar: [
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "undo",
      "redo",
    ],
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={text || "<p></p>"}
      onChange={handleChange}
      config={config}
    />
  )
}
