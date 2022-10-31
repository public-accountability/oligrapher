import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHotkeys } from 'react-hotkeys-hook'

import LockPoll from './LockPoll'
import LockModal from './LockModal'
import RefreshModal from './RefreshModal'

export default function LockManager() {
  const dispatch = useDispatch()
  const { name, start } = useSelector(state => state.attributes.lock.refresh)
  const { userHasLock } = useSelector(state => state.attributes.lock)

  useHotkeys('ctrl+r+l', () => {
    if (userHasLock) {
      dispatch({ type: 'LOCK_RELEASE_REQUESTED' })
    }
  }, null, [userHasLock])

  return (
    <div id="oligrapher-lock-manager">
      <LockPoll />
      <LockModal />
      { name && start && <RefreshModal name={name} start={start} /> }
    </div>
  )
}
