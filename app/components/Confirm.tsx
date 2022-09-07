import React from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText
} from '@mui/material'

export default function Confirm({ open, message, cancel, confirm }: ConfirmProps) {
  return (
    <Dialog
      id="oligrapher-confirm"
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description">
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel.onClick} variant="contained" color="primary">
          {cancel.label}
        </Button>
        <Button id="oligrapher-confirm-button" onClick={confirm.onClick} variant="contained" color="secondary">
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
  open: boolean,
  message: string,
  cancel: Button,
  confirm: Button
}
