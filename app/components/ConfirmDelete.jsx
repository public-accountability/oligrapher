import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

export default function ConfirmDelete({ open, close, deleteMap }) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this map?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="contained" color="default" textTransform="none">
          Cancel
        </Button>
        <Button onClick={deleteMap} variant="contained" color="secondary" textTransform="none">
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