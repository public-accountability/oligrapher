import React from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

export default function EmptySave({ open, close }: EmptySaveProps) {
  return (
    <Dialog open={open} onClose={close} aria-describedby="alert-dialog-description">
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This map is empty! Put something in it before you save.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface EmptySaveProps {
  open: boolean
  close: () => void
}
