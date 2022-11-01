import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

export default function Confirm({ open, message, cancel, confirm }: ConfirmProps) {
  return (
    <Dialog
      id="oligrapher-confirm"
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel.onClick} variant="contained" color="primary">
          {cancel.label}
        </Button>
        <Button
          id="oligrapher-confirm-button"
          onClick={confirm.onClick}
          variant="contained"
          color="secondary"
        >
          {confirm.label}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface Button {
  onClick: () => void
  label: string
}

interface ConfirmProps {
  open: boolean
  message: string
  cancel: Button
  confirm: Button
}
