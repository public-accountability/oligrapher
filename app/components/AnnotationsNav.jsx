import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

export default function AnnotationsNav({ count, currentIndex, prev, next }) {
  return (
    <>
      <Button 
        variant="outlined" 
        onClick={prev}
        disabled={currentIndex === 0}
      >Prev</Button>
      &nbsp;
      <Button 
        variant="outlined"
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