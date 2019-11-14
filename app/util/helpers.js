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
