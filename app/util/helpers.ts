import { SyntheticEvent, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import isFunction from 'lodash/isFunction'
import toNumber from 'lodash/toNumber'
import { createMuiTheme } from '@material-ui/core/styles'

import { Selector } from './selectors'
import { StateWithHistory } from './defaultState'
import ConfirmSave from '../components/ConfirmSave'

export function classNames(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function callWithTargetValue(func: (arg: any) => any): (event: Event) => any {
  return function(event: Event) {
    const value = (event.target as HTMLInputElement).value
    return func(value)
  }
}

export function callWithPersistedEvent(func: (arg: any) => any): (event: SyntheticEvent) => any {
  return function(event: SyntheticEvent) {
    if (isFunction(event.persist)) {
      event.persist()
    }
    return func(event)
  }
}

// source: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export function makeCancelable(promise: Promise<any>): { promise: Promise<any>, cancel: () => void } {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled ? reject({ isCanceled: true }) : resolve(val),
      error => hasCanceled ? reject({ isCanceled: true }) : reject(error)
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    }
  }
}

export function frozenArray(...items: any[]): readonly any[] {
  return Object.freeze(items)
}

export function isLittleSisId(id: any): boolean {
  return Number.isFinite(toNumber(id))
}

export function useSaveMap() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const isSaving = useSelector<StateWithHistory>(state => state.display.saveMapStatus === 'REQUESTED')
  const version = useSelector<StateWithHistory>(state => state.attributes.version)

  const saveMap = useCallback(() => {
    if (version === 3) {
      dispatch({ type: 'SAVE_REQUESTED' })
    } else {
      setOpen(true)
    }
  }, [version, dispatch])

  const save = useCallback(() => {
    dispatch({ type: 'SAVE_REQUESTED' })
    setOpen(false)
  }, [dispatch])

  const close = useCallback(() => setOpen(false), [])

  return { isSaving, saveMap, confirmSave: ConfirmSave({ open, close, save })  }
}

// For now, this isn't needed because we flatten state.graph after every action:
//
// export const convertSelectorForUndo = selector => (state => selector({
//   graph: state.graph.present,
//   display: state.display,
//   attributes: state.attributes,
//   settings: state.settings
// }))

export const convertSelectorForUndo = (selector: Selector): Selector => selector

function useConvertedSelector(selector: Selector) {
  return useSelector(convertSelectorForUndo(selector))
}

export { useConvertedSelector as useSelector }

export const muiTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true
    },
    MuiButton: {
      disableElevation: true
    }
  },
  palette: {
    primary: {
      main: '#2c63c8',
    },
    secondary: {
      main: '#c82c63'
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  },
  overrides: {
    MuiDialogActions: {
      root: {
        padding: '1em',
        justifyContent: 'center'
      }
    },
    MuiButton: {
      root: {
        minWidth: 'none'
      }
    },
    MuiSelect: {
      root: {
        padding: 5,
        paddingLeft: 10
      }
    },
    MuiInput: {
      root: {
        border: '1px solid #eee',
        padding: '0.5em'
      },
      underline: {
        '&:hover::before': {
          border: '0 !important'
        },
        '&::before': {
          border: 0
        },
        '&::after': {
          border: 0
        }
      }
    }
  }
})