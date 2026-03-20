import React, { useCallback } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
    ClassicEditor,
    Essentials,
    CKFinderUploadAdapter,
    Autoformat,
    Bold,
    Italic,
    BlockQuote,
    CKBox,
    CKFinder,
    EasyImage,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    TextTransformation,
    CloudServices
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

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
    licenseKey: 'GPL',
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
