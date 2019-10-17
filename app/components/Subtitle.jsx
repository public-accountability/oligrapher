import React from 'react'
import PropTypes from 'prop-types'

export default function Subtitle({text}) {
  if (!text) { return <></> }

  return <div id="oligrapher-header-subtitle-wrapper">
           <h2>{text}</h2>
         </div>
}

Subtitle.propTypes = {
  "text": PropTypes.string
}
