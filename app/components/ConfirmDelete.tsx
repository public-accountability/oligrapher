import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

export default function ConfirmDelete({ open, cancel, confirm }: ConfirmDeleteProps) {
  return (
    <Dialog
      id="confirm-delete"
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this map?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel} variant="contained" color="default">
          Cancel
        </Button>
        <Button id="confirm-delete-button" onClick={confirm} variant="contained" color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface ConfirmDeleteProps {
  open: boolean,
  cancel: () => void,
  confirm: () => void
}