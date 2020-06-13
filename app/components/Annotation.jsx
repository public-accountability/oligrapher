import React from 'react'
import PropTypes from 'prop-types'

export default function Annotation({ annotation: { header, text } }) {
  return (
    <div className="oligrapher-annotation">
      <div className="oligrapher-annotation-header">
        {header}
      </div>

      <div className="oligrapher-annotation-text" dangerouslySetInnerHTML={{ __html: text }}>
      </div>
    </div>
  )
}

Annotation.propTypes = {
  annotation: PropTypes.object.isRequired
}