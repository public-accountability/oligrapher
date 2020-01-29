import pick from 'lodash/pick'

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

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function callWithTargetValue(func) {
  return function(event) {
    const value = event.target.value
    return func(value)
  }
}
