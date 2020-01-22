import React from 'react'
import PropTypes from 'prop-types'
import Node from '../../graph/node'

import EndPoints from './EndPoints'

export default function LineStyle(props) {
  return <div className="edit-edge-line-style">
           <EndPoints nodes={props.nodes} updateArrow={props.updateArrow} />
         </div>
}

LineStyle.propTypes = {
  nodes: Node.types.arrayOfNodes.isRequired,
  updateArrow: PropTypes.func.isRequired
}
