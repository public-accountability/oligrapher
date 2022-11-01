import React from "react"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

export default function Disclaimer({ open, close }: DisclaimerProps) {
  return (
    <Dialog
      id="oligrapher-disclaimer"
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Disclaimer</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <strong>User-contributed maps don't represent the views of LittleSis.</strong>
          <br />
          <a href="https://littlesis.org/disclaimer" target="_blank">
            Click here
          </a>{" "}
          to read our full disclaimer.
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

export interface DisclaimerProps {
  open: boolean
  close: () => void
}
