import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

export default function AnnotationsNav({ count, currentIndex, prev, next, size }) {
  return (
    <>
      <Button 
        variant="outlined"
        size={size}
        onClick={prev}
        disabled={currentIndex === 0}
      >Prev</Button>
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        size={size}
        onClick={next}
        disabled={currentIndex > count - 2 }
      >Next</Button>
    </>
  )
}

AnnotationsNav.propTypes = {
  count: PropTypes.number.isRequired,
  currentIndex: PropTypes.number.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired
}

AnnotationsNav.defaultProps = {
  size: "medium"
}