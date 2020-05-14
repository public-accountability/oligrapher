import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

export default function ConfirmDelete({ open, close, deleteMap }) {
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
        <Button onClick={close} variant="contained" color="default">
          Cancel
        </Button>
        <Button id="confirm-delete-button" onClick={deleteMap} variant="contained" color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmDelete.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  deleteMap: PropTypes.func.isRequired
}