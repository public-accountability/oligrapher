import React from 'react'
import PropTypes from 'prop-types'


import EndPoints from './EndPoints'

import { nodePropTypes } from '../../graph/node'


export default function LineStyle(props) {
  return <div className="edit-edge-line-style">
           <EndPoints nodes={props.nodes} />
         </div>
}


LineStyle.propTypes = {
  nodes: PropTypes.arrayOf(nodePropTypes).isRequired
}
