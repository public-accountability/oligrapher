import { SyntheticEvent } from 'react'
import isFunction from 'lodash/isFunction'
import toNumber from 'lodash/toNumber'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'

import { Selector } from './selectors'

export function classNames(...classes: Array<string>): string {
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
    }
  }
})