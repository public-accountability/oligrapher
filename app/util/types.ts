import PropTypes from 'prop-types'

export const stringOrNumber = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export const stringOrBool = PropTypes.oneOfType([PropTypes.string, PropTypes.bool])