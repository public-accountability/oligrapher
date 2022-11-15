import React from "react"
import { useSelector } from "react-redux"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

import { lockUsernameSelector, userIsOwnerSelector } from "../util/selectors"

type LockModalProps = {
  closeEditor: () => void
  takeover: () => void
}

export default function LockModal(props: LockModalProps) {
  const isOwner = useSelector(userIsOwnerSelector)
  const lockOwnerName = useSelector(lockUsernameSelector)

  return (
    <Dialog id="oligrapher-lock-modal" open={true}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p>
            <strong>{lockOwnerName}</strong> is editing this map right now. Get in touch with
            yourteam to get editing control.
          </p>

          {isOwner && (
            <p>
              As the owner of this map{" "}
              <strong>
                you can resume editing, but {lockOwnerName} might lose any unsaved changes.
              </strong>
            </p>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeEditor} variant="outlined">
          Close editor
        </Button>
        {isOwner && (
          <Button onClick={props.takeover} variant="contained" color="primary">
            Resume editing
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
