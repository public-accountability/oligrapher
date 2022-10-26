import React from "react"
import Button from "@mui/material/Button"
import noop from "lodash/noop"

type EditorSubmitButtonsPropTypes = {
  handleSubmit?: React.MouseEventHandler
  handleDelete?: React.MouseEventHandler
  hideSubmitButton?: boolean
  hideDeleteButton?: boolean
  page: string
  setPage?: (page: string) => void
}

export default function EditorSubmitButtons({
  handleSubmit = noop,
  handleDelete = noop,
  setPage = noop,
  hideDeleteButton = false,
  hideSubmitButton = false,
  page,
}: EditorSubmitButtonsPropTypes) {
  return (
    <div className="editor-buttons" data-testid="edge-editor-submit-buttons">
      {!hideDeleteButton && page === "main" && (
        <Button
          onClick={handleDelete}
          variant="contained"
          color="secondary"
          size="small"
          disableElevation={true}
          data-testid="edge-editor-delete-button"
        >
          Delete
        </Button>
      )}

      {page !== "main" && (
        <Button
          onClick={() => setPage("main")}
          variant="contained"
          color="primary"
          size="small"
          disableElevation={true}
          data-testid="edge-editor-back-button"
        >
          Back
        </Button>
      )}

      {!hideSubmitButton && (
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          size="small"
          disableElevation={true}
          data-testid="edge-editor-apply-button"
        >
          Apply
        </Button>
      )}
    </div>
  )
}
