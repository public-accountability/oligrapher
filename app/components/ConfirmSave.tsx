import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

export default function ConfirmSave({ open, close, save }: ConfirmSaveProps) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This map was created with the previous vesion of Oligrapher. 
          If you save the map with this version, <strong>you will no longer be able to view or edit it with the previous version</strong>.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="contained" color="default">
          Cancel
        </Button>
        <Button onClick={save} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface ConfirmSaveProps {
  open: boolean,
  close: () => void,
  save: () => void
}