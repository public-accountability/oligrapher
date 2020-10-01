import produce from 'immer'

import { LsMap } from '../datasources/littlesis3'

export default produce((lastSavedData: LsMap, action: any): void => {
  switch(action.type) {
   case 'SET_SAVED_DATA':
    return action.data
  default:
    return
  }
}, null)
