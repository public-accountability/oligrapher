import React from 'react'
import PropTypes from 'prop-types'
import isFunction from 'lodash/isFunction'

/*
  There are two ways to create a menu item:

  If the prop "url" is provided a simple link is created.
  If the prop "action" (a function) is provided,
  that function is set to the onClick action.

*/
export default function HeaderMenuItem({ text, action, url }) {
  let linkAttrs = {}

  if (action) {
    linkAttrs.href = '#'
    linkAttrs.onClick = action
  } else {
    linkAttrs.href = url
  }

  return (
    <li>
      <a {...linkAttrs}>{text}</a>
    </li>
  )
}


const hasEitherUrlOrAction = function(props) {
  if (!props.url && !props.action) {
    return new Error("Missing either prop 'url' or 'action'")
  }

  if (props.action && !isFunction(props.action)) {
    return new Error("Action is not a function")
  }

  if (props.url && !(typeof props.url === 'string')) {
    return new Error("Url is not a String")
  }
}

HeaderMenuItem.propTypes = {
  "text": PropTypes.string.isRequired,
  "url": hasEitherUrlOrAction,
  "action": hasEitherUrlOrAction
}
