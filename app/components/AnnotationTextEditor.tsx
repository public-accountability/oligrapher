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

class Editor extends ClassicEditor {
    static builtinPlugins = [
        Essentials,
        CKFinderUploadAdapter,
        Autoformat,
        Bold,
        Italic,
        BlockQuote,
        CKBox,
        CKFinder,
        CloudServices,
        EasyImage,
        Heading,
        Image,
        ImageCaption,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        Link,
        List,
        MediaEmbed,
        Paragraph,
        PasteFromOffice,
        PictureEditing,
        Table,
        TableToolbar,
        TextTransformation
    ];

    static defaultConfig = {
        licenseKey: 'GPL',
        toolbar: {
            items: [
                'undo', 'redo',
                '|', 'heading',
                '|', 'bold', 'italic',
                '|', 'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
                '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
            ]
        },
        image: {
            toolbar: [
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'toggleImageCaption',
                'imageTextAlternative'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },
        language: 'en'
    };
}

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
