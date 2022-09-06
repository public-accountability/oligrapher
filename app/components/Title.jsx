import React from 'react'
import PropTypes from 'prop-types'

import { callWithTargetValue } from '../util/helpers'

export default function Title({ text, editable, onChange, url }) {

  return <h1 id="oligrapher-title">
           {
             editable
               ? <input value={text}
                        onChange={callWithTargetValue(onChange)}
                        placeholder="Title"
                        data-testid="oligrapher-title-input"
                 />
             : url ? <a href={url} target="_blank" rel="noreferrer" title="View this map on LittleSis">{text}</a> : text
           }
         </h1>
}

Title.propTypes = {
  text: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  url: PropTypes.string
}
