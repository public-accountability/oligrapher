import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import consumer from "../util/consumer"
import {
  editModeSelector,
  enableActionCableSelector,
  otherUserHasLockSelector,
} from "../util/selectors"
import LockModal from "./LockModal"

export default function LockManager() {
  const dispatch = useDispatch()
  const id = useSelector(state => state.attributes.id)
  const enableActionCable = useSelector(enableActionCableSelector)
  const otherUserHasLock = useSelector(otherUserHasLockSelector)
  const editorMode = useSelector(editModeSelector)

  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    if (enableActionCable) {
      if (consumer.subscriptions.subscriptions.length === 0) {
        const channel = { channel: "OligrapherChannel", id: id }

        setSubscription(
          consumer.subscriptions.create(channel, {
            connected() {
              // dispatch({ type: "CHANNEL_SUBSCRIBED" })
            },
            received(data) {
              if (data.lock) {
                dispatch({ type: "SET_LOCK", lock: data.lock })

                // if message arrives saying map is unlocked set lock
                if (!data.lock.locked) {
                  this.perform("lock")
                }
              }
            },
          })
        )
      }

      return () => {
        if (consumer.subscriptions.subscriptions.length > 0) {
          consumer.remove(consumer.subscriptions.subscriptions[0])
        }
      }
    }
  }, [enableActionCable])

  if (editorMode && otherUserHasLock) {
    const closeEditor = () => {
      dispatch({ type: "SET_EDITOR_MODE", enabled: false })
    }
    const takeover = () => {
      subscription.perform("takeover")
    }
    return <LockModal closeEditor={closeEditor} takeover={takeover} />
  } else {
    return null
  }
}
