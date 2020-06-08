import React from 'react'
import PropTypes from 'prop-types'

export default function Annotation({ annotation: { title, text } }) {
  return (
    <div className="oligrapher-annotation">
      <div className="oligrapher-annotation-title">
        {title}
      </div>

      <div className="oligrapher-annotation-text" dangerouslySetInnerHTML={{ __html: text }}>
      </div>
    </div>
  )
}

Annotation.propTypes = {
  annotation: PropTypes.object.isRequired
}