import pick from 'lodash/pick'
import isFunction from 'lodash/isFunction'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import toNumber from 'lodash/toNumber'
import isNil from 'lodash/isNil'
import { useSelector as useReduxSelector } from 'react-redux'

/**
 * works the same as document.getElementById,
 * except it throws an error if the element does not exist.
 */
export function getElementById(id) {
  const element = document.getElementById(id)

  if (element) {
    return element
  } else {
    throw new Error(`Document is missing the element with id ${id}`)
  }
}

export function isElement(element) {
  return element instanceof Element || element instanceof HTMLDocument
}

// Element | String => Element | Throws
export function toElement(idOrElement) {
  if (isElement(idOrElement)) {
    return idOrElement
  }

  if (typeof idOrElement === 'string') {
    return getElementById(idOrElement)
  }

  throw new Error(`Excepted an Element or String. Received: ${typeof idOrElement}`)
}

export function xy(obj) {
  return pick(obj, ['x', 'y'])
}

export function xyArray(obj) {
  return [ obj.x, obj.y ]
}

export function xyFromArray(arr) {
  return {
    x: arr[0],
    y: arr[1]
  }
}

export function translatePoint(point, deltas) {
  return {
    x: point.x + deltas.x,
    y: point.y + deltas.y
  }
}

export function rotatePoint(point, angle) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = point.x * cos - point.y * sin
  const y = point.x * sin + point.y * cos
  return { x, y }
}

export function distance(point1, point2) {
  let a = point1.x - point2.x
  let b = point1.y - point2.y
  return Math.hypot(a, b)
}

// Any number of Strings or Booleans => String
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Function => Function
export function callWithTargetValue(func) {
  return function(event) {
    const value = event.target.value
    return func(value)
  }
}

// Function => Function
export function callWithPersistedEvent(func) {
  return function(event) {
    if (isFunction(event.persist)) {
      event.persist()
    }
    return func(event)
  }
}

// Promise => { promise<Promise>, cancel<func>}
// source: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export function makeCancelable(promise) {
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

export function frozenArray(...items) {
  return Object.freeze(items)
}

/*
  useState() is often used to store an object instead of a single value,
  but  in order to modify the object, the caller must copy the entire state.
  This helper creates a function that allows a single key/value to be easily changed,
  without having to remember to merge the old state.

     const [attributes, setAttributes] = useState({x: 1, foo: 'bar'})
     const updateFoo = createStateUpdater(setAttributes, 'foo')
     updateFoo('baz') // state is changed to {x: 1, foo: 'baz'}
*/
export function createStateUpdater(setStateFunction, attributeName) {
  return function(eventOrValue) {
    if (isString(eventOrValue) || isNumber(eventOrValue) || isNil(eventOrValue.target)) {
      setStateFunction(oldState => ({...oldState, [attributeName]: eventOrValue}))
    } else {
      let value = eventOrValue.target.value
      setStateFunction(oldState => ({...oldState, [attributeName]: value}))
    }
  }
}

export function isLittleSisId(id) {
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

export const convertSelectorForUndo = selector => selector

// redux-undo places the present state at state.present, so we use our own
// useSelector() to "transparently" make this change to all our selectors
export function useSelector(selector) {
  return useReduxSelector(convertSelectorForUndo(selector))
}
