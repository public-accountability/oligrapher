import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Annotation from "./Annotation"
import RemoveAnnotationButton from "./RemoveAnnotationButton"
import AnnotationsNav from "./AnnotationsNav"
import AnnotationsTracker from "./AnnotationsTracker"
import HideAnnotationsButton from "./HideAnnotationsButton"
import { annotationsListSelector, editModeSelector, svgHeightSelector } from "../util/selectors"
import AnnotationForm from "./AnnotationForm"
import AnnotationList from "./AnnotationList"

export function Annotations() {
  const dispatch = useDispatch()
  const create = useCallback(() => dispatch({ type: "CREATE_ANNOTATION" }), [dispatch])

  const svgHeight = useSelector(svgHeightSelector)
  const editing = useSelector(editModeSelector)
  const { currentIndex } = useSelector(state => state.annotations)
  const list = useSelector(annotationsListSelector)
  const annotation = list[currentIndex]
  const { storyModeOnly } = useSelector(state => state.attributes.settings)

  const prev = useCallback(
    () => dispatch({ type: "SHOW_ANNOTATION", index: currentIndex - 1 }),
    [dispatch, currentIndex]
  )

  const next = useCallback(
    () => dispatch({ type: "SHOW_ANNOTATION", index: currentIndex + 1 }),
    [dispatch, currentIndex]
  )

  const show = useCallback(index => dispatch({ type: "SHOW_ANNOTATION", index }), [dispatch])

  return (
    <div id="oligrapher-annotations" style={{ height: svgHeight - 10, overflow: "auto" }}>
      <div id="oligrapher-annotations-body">
        <div id="oligrapher-annotations-nav">
          {editing && (
            <Typography variant="h4" className="oligrapher-annotations-header">
              Edit Annotations
            </Typography>
          )}

          {!editing && list.length > 1 && (
            <AnnotationsNav
              count={list.length}
              currentIndex={currentIndex}
              prev={prev}
              next={next}
            />
          )}

          {!editing && list.length > 1 && (
            <AnnotationsTracker count={list.length} currentIndex={currentIndex} show={show} />
          )}

          {!storyModeOnly && <HideAnnotationsButton />}
        </div>

        {!editing && <Annotation annotation={annotation} />}

        {editing && <AnnotationList list={list} currentIndex={currentIndex} />}

        <br />

        {editing && (
          <div className="oligrapher-annotations-actions">
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button onClick={create} variant="outlined" size="small">
                Add Annotation
              </Button>
              {annotation && <RemoveAnnotationButton annotation={annotation} />}
            </Stack>
          </div>
        )}

        {editing && annotation && <AnnotationForm annotation={annotation} key={annotation.id} />}
      </div>
    </div>
  )
}

export default Annotations
