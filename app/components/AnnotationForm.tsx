import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import Button from "@mui/material/Button"
import Input from "@mui/material/Input"

import { callWithTargetValue } from "../util/helpers"
import AnnotationTextEditor from "./AnnotationTextEditor"
import { Annotation } from "../util/annotations"

type AnnotationFormProps = {
  annotation: Annotation
}

export default function AnnotationForm({ annotation }: AnnotationFormProps) {
  const { id, header, text } = annotation

  const dispatch = useDispatch()
  const update = attributes => dispatch({ type: "UPDATE_ANNOTATION", id, attributes })
  const clearHighlights = () => dispatch({ type: "CLEAR_HIGHLIGHTS" })

  const macintosh = navigator.userAgent.indexOf("Macintosh") > -1
  const holdKey = macintosh ? "⌘" : "Control"

  const updateHeader = useCallback(
    callWithTargetValue(header => update({ header })),
    [update]
  )

  return (
    <div id="oligrapher-annotation-form">
      <div className="oligrapher-annotation-form-header">
        <Input
          id="oligrapher-annotation-form-header"
          placeholder="Annotation header"
          value={header}
          onChange={updateHeader}
        />
      </div>

      <div className="oligrapher-annotation-form-text">
        <AnnotationTextEditor text={text} onChange={text => update({ text })} />
      </div>

      <div className="oligrapher-annotation-highlighting-tip">
        Press the {holdKey} key while clicking on nodes, edges, or texts to add or remove highlights
        from this annotation.
        <br />
        <Button variant="outlined" size="small" onClick={clearHighlights}>
          Clear Highlighting
        </Button>
      </div>
    </div>
  )
}
