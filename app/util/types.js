import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'

export const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export const stringOrBool = PropTypes.oneOfType([PropTypes.string, PropTypes.bool])

export const isFunctionIfEditable = (props, propName, componentName) => {
  if (props.editable && !isFunction(props[propName])) {
    return new Error(`No ${propName} function provided to <${componentName}>`)
  }
}
