import { Editor, AttributesState } from './defaultState'

interface RefreshLockState {
  name: string | null,
  start: number | null
}

const emptyRefreshLockState: RefreshLockState = {
  name: null,
  start: null
}

export interface LockState {
  locked: boolean,
  userHasLock: boolean,
  name: string | null,
  userHasPermission: boolean,
  refresh: RefreshLockState
}

export interface LittlesisLockState {
  locked: boolean,
  user_has_lock: boolean,
  name: string | null,
  permission_denied?: boolean,
  editors?: Editor[]
}

export const defaultLockState: LockState = { 
  locked: false, 
  userHasLock: false,
  name: null,
  userHasPermission: true,
  refresh: emptyRefreshLockState
}

export const updateLock = (lock: LockState, lockData: LittlesisLockState): LockState => {
  const refresh = (!lock.userHasLock && lockData.user_has_lock) ? {
    name: lock.name as string,
    start: Date.now()
  } : lock.refresh

  return transformLockData(lockData, refresh)
}

export const transformLockData = (
  lockData: LittlesisLockState,
  refresh: RefreshLockState = emptyRefreshLockState
): LockState => {
  return lockData.permission_denied ? {
    locked: true,
    userHasLock: false,
    name: null,
    userHasPermission: false,
    refresh: emptyRefreshLockState
  } : {
    locked: lockData.locked,
    userHasLock: lockData.user_has_lock,
    name: lockData.name,
    userHasPermission: true,
    refresh
  }
}