import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'

export const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export const stringOrBool = PropTypes.oneOfType([PropTypes.string, PropTypes.bool])

const isFunctionIfX = x => (props, propName, componentName) => {
  if (props[x] && !isFunction(props[propName])) {
    return new Error(`No ${propName} function provided to <${componentName}>`)
  }
}

export const isFunctionIfEditable = isFunctionIfX('editable')
export const isFunctionIfEnabled = isFunctionIfX('enabled')
