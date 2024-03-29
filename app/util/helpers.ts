import React, { SyntheticEvent, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import isFunction from "lodash/isFunction"
import toNumber from "lodash/toNumber"
import ConfirmSave from "../components/ConfirmSave"
import EmptySave from "../components/EmptySave"
import { hasContents } from "../graph/graph"
import { State } from "./defaultState"

export function classNames(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ")
}

export function callWithTargetValue(
  func: (arg: any) => any
): (event: Event | React.ChangeEvent) => any {
  return function (event: Event | React.ChangeEvent) {
    const value = (event.target as HTMLInputElement).value
    return func(value)
  }
}

export function callWithPersistedEvent(func: (arg: any) => any): (event: SyntheticEvent) => any {
  return function (event: SyntheticEvent) {
    if (isFunction(event.persist)) {
      event.persist()
    }
    return func(event)
  }
}

// source: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export function makeCancelable(promise: Promise<any>): {
  promise: Promise<any>
  cancel: () => void
} {
  let hasCanceled = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled ? reject({ isCanceled: true }) : reject(error))
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled = true
    },
  }
}

export function frozenArray(...items: any[]): readonly any[] {
  return Object.freeze(items)
}

export function omit(obj: any, key: string): object {
  let clone = Object.assign({}, obj)
  delete clone[key]
  return clone
}

export function isLittleSisId(id: any): boolean {
  return Number.isFinite(toNumber(id))
}

export const eventTargetIsFormElement = (event: Event): boolean => {
  return ["INPUT", "TEXTAREA", "SELECT"].includes((event.target as HTMLElement)?.tagName)
}

export function useSaveMap() {
  const dispatch = useDispatch()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [emptyOpen, setEmptyOpen] = useState(false)
  const isSaving = useSelector<State>(state => state.display.saveMapStatus === "REQUESTED")
  const version = useSelector<State>(state => state.attributes.version)
  const isEmpty = useSelector<State>(state => !hasContents(state.graph))

  const saveMap = useCallback(() => {
    if (isEmpty) {
      setEmptyOpen(true)
    } else if (version === 3) {
      dispatch({ type: "SAVE_REQUESTED" })
    } else {
      setConfirmOpen(true)
    }
  }, [version, dispatch, isEmpty])

  const save = useCallback(() => {
    dispatch({ type: "SAVE_REQUESTED" })
    setConfirmOpen(false)
  }, [dispatch])

  const closeConfirm = useCallback(() => setConfirmOpen(false), [])
  const closeEmpty = useCallback(() => setEmptyOpen(false), [])

  return {
    isSaving,
    saveMap,
    confirmSave: ConfirmSave({ open: confirmOpen, close: closeConfirm, save }),
    emptySave: EmptySave({ open: emptyOpen, close: closeEmpty }),
  }
}

type RectCallback = (rect: DOMRect | null) => void

export function useClientRect(callback: RectCallback) {
  return useCallback((node: HTMLElement) => {
    if (node) {
      callback(node.getBoundingClientRect())
    } else {
      callback(null)
    }
  }, [])
}

export function getElementById(id: string): Element {
  let element = document.getElementById(id)

  if (element) {
    return element
  } else {
    throw new Error(`#${id} is not in the document`)
  }
}

export function querySelector(query: string): Element {
  const element = document.querySelector(query)

  if (element) {
    return element
  } else {
    throw new Error(`Expecting to find "${query}" in the document`)
  }
}

export function getElementForGraphItem(id: string, t: "node" | "edge" | "caption" | "connections") {
  if (t === "connections") {
    t = "node"
  }

  return querySelector(`g#${t}-${id}`) as SVGGElement
}

export function eventHalt(event: React.BaseSyntheticEvent) {
  event.stopPropagation()
  event.preventDefault()
}

// For now, this isn't needed because we flatten state.graph after every action:
//
// export const convertSelectorForUndo = selector => (state => selector({
//   graph: state.graph.present,
//   display: state.display,
//   attributes: state.attributes,
//   settings: state.settings
// }))

// export const convertSelectorForUndo = (selector: Selector<any>): Selector<any> => selector

// function useConvertedSelector(selector: Selector<any>) {
//   return useSelector(convertSelectorForUndo(selector))
// }

export { useSelector as useSelector }
