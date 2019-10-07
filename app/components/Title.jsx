import React from 'react'
import PropTypes from 'prop-types'

export default function Title({title}) {
  return <div id="oligrapher-header-title-wrapper">
           <h1>{title}</h1>
         </div>
}

Title.propTypes = {
  "title": PropTypes.string.isRequired
}
