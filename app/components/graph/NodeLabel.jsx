import React from 'react'
import PropTypes from 'prop-types'


// TODO: Splits name into separate based on length of name
export function textLines(name) {
  return [name]
}

export default function NodeLabel({name, scale}) {
  return <></>
}

NodeLabel.propTypes = {
  name:  PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired
}

NodeLabel.defaultProps = {
  name: '',
  scale: 1
}
