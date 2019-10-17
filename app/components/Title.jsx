import React from 'react'
import PropTypes from 'prop-types'

export default function Title({text}) {
  return <div id="oligrapher-header-title-wrapper">
           <h1>{text}</h1>
         </div>
}

Title.propTypes = {
  "text": PropTypes.string.isRequired
}
