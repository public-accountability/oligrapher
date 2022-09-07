import * as React from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material'

export default function ShareModal({ open, close, url }: ShareModalProps) {
  const { protocol, host } = window.location
  const fullUrl = protocol + '//' + host + url

  return (
    <Dialog
      id="oligrapher-share"
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Share Map</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This map is private, but others can view it using this secret link:
          <br />
          <a href={fullUrl} target="_blank">{fullUrl}</a>
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

export interface ShareModalProps {
  open: boolean,
  close: () => void,
  url: string
}
