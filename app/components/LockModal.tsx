import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"

import { useSelector } from "../util/helpers"
import { userIsOwnerSelector } from "../util/selectors"

export default function LockModal() {
  const dispatch = useDispatch()
  const closeEditor = () => dispatch({ type: "SET_EDITOR_MODE", enabled: false })
  const takeoverLock = () => dispatch({ type: "LOCK_TAKEOVER_REQUESTED" })

  const { locked, userHasLock, name, userHasPermission } = useSelector(
    state => state.attributes.lock
  )
  const isOwner = useSelector(userIsOwnerSelector)

  return (
    <Dialog
      id="oligrapher-lock-modal"
      open={locked && !userHasLock}
      onClose={closeEditor}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {userHasPermission && (
            <>
              <strong>{name}</strong> is editing this map right now. Get in touch with your team to
              get editing control.
              {isOwner && (
                <>
                  <br />
                  <br />
                  As the owner of this map,{" "}
                  <strong>
                    you can resume editing, but {name} will lose any unsaved changes!
                  </strong>{" "}
                  (It will also cause this page to reload.)
                </>
              )}
            </>
          )}
          {!userHasPermission && (
            <>
              You don't have permission to edit this map. Get in touch with the map owner to be
              added as an editor.
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeEditor} variant="outlined">
          Close editor
        </Button>
        {isOwner && (
          <Button onClick={takeoverLock} variant="contained" color="primary">
            Resume editing
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
