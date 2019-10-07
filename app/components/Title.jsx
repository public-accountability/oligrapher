import React from 'react'
import PropTypes from 'prop-types'

export default function Title({title, subtitle}) {
  return <div id="oligrapher-header-title-wrapper">
           <h1>{title}</h1>
           <h2>{subtitle}</h2>
         </div>
}

Title.propTypes = {
  "title": PropTypes.string.isRequired,
  "subtitle": PropTypes.string
}

Title.defaultProps = {
  "subtitle": ""
}
