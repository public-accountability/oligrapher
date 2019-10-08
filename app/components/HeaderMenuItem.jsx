import React from 'react'
import PropTypes from 'prop-types'

export default function HeaderMenuItem(props) {
  return <li>
           <a href={props.url}>{props.text}</a>
         </li>
}


HeaderMenuItem.propTypes = {
  "text": PropTypes.string.isRequired,
  "url": PropTypes.string.isRequired
}
