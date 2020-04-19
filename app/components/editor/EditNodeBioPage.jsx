import React from 'react'
import PropTypes from 'prop-types'

import { callWithTargetValue } from '../../util/helpers'

export default function EditNodeBioPage(props) {
  return (
    <textarea rows="5"
      cols="25"
      onChange={callWithTargetValue(props.onChange)}
      value={props.text} />
  )
}

EditNodeBioPage.propTypes = {
  text: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
