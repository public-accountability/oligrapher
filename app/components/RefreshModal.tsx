import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

const WAIT_TIME = 10 * 1000

type RefreshModalPropTypes = {
  name: string
  start: number
}

export default function RefreshModal({ name, start }: RefreshModalPropTypes) {
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
    <Dialog open={true} onClose={refresh} aria-describedby="alert-dialog-description">
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <strong>{name}</strong> has finished editing this map, and your copy may be out-of-date.
          <br />
          <br />
          This page will refresh in {timeLeft} seconds.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={refresh} variant="contained" color="default">
          Refresh
        </Button>
      </DialogActions>
    </Dialog>
  )
}
