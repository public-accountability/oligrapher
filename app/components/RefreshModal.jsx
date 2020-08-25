import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { 
  Button, Dialog, DialogActions, DialogContent, DialogContentText 
} from '@material-ui/core'

const WAIT_TIME = 10 * 1000

export default function RefreshModal({ name, start }) {
  const calculateTimeLeft = () => Math.ceil((start + WAIT_TIME - Date.now()) / 1000)

  const refresh = () => {
    window.location.reload()
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  let interval

  useEffect(() => {
    interval = setInterval(() => {
      let time = calculateTimeLeft()
      console.log("refresh modal time left:", time)

      if (time < 0) {
        clearInterval(interval)
        refresh()
      } else {
        setTimeLeft(time)
      }

    }, 100)

    return () => clearInterval(interval)
  })

  return (
    <>
      <Dialog
        open={true}
        onClose={refresh}
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>{ name }</strong> has finished editing this map,
            and your copy may be out-of-date.
            <br />
            <br />
            This page will refresh in { timeLeft } seconds.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={refresh} variant="contained" color="default">
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

RefreshModal.propTypes = {
  name: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired
}