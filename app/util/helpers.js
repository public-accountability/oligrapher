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

export function translatePoint(start, deltas) {
  return {
    x: start.x + deltas.x,
    y: start.y + deltas.y
  }
}
