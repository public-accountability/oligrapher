import React from 'react'
import PropTypes from 'prop-types'

export default function AnnotationsTracker({ count, currentIndex, show }) {
  const className = i => "tracker-circle" + (i === currentIndex ? " tracker-circle-selected" : "")

  return (
    <div id="oligrapher-annotations-tracker">
      { Array(count).fill(null).map((e, i) => (
        <div key={i} className={className(i)} onClick={() => show(i)}></div>
      )) }
    </div>
  )
}

AnnotationsTracker.propTypes = {
  count: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  show: PropTypes.func.isRequired
}
