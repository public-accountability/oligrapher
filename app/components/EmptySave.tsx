import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

export default function EmptySave({ open, close, }: EmptySaveProps) {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This map is empty! Put something in it before you save.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} variant="contained" color="default">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface EmptySaveProps {
  open: boolean,
  close: () => void
}
 