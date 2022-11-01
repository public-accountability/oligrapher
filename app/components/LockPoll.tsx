import React, { useEffect } from "react"
import { useDispatch } from "react-redux"

import { useSelector, makeCancelable } from "../util/helpers"
import { lock } from "../datasources/littlesis3"

const POLL_INTERVAL = 10 * 1000
const FAILURE_LIMIT = 10

export default function LockPoll() {
  const dispatch = useDispatch()
  const mapId = useSelector(state => state.attributes.id)

  let failCount = 0
  let httpRequest
  let timeout

  const requestLock = () => {
    httpRequest = makeCancelable(lock(mapId))

    httpRequest.promise
      .then(json => {
        dispatch({ type: "SET_LOCK", lock: json })
        timeout = setTimeout(() => requestLock(), POLL_INTERVAL)
      })
      .catch(err => {
        failCount++

        if (failCount > FAILURE_LIMIT) {
          console.error(`Poll HTTP request failed too many times`)
        } else {
          timeout = setTimeout(() => requestLock(), POLL_INTERVAL)
        }
      })

    return () => {
      httpRequest.cancel()
      clearTimeout(timeout)
    }
  }

  useEffect(requestLock, [mapId, dispatch])

  return null
}
