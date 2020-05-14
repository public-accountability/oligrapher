import React from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@material-ui/core'

export default function Disclaimer({ open, close }) {
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
          <a href="https://littlesis.org/disclaimer" target="_blank">Click here</a> to read our full disclaimer.
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

Disclaimer.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
} 