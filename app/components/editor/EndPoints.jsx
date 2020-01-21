import React from 'react'
import PropTypes from 'prop-types'
//import { useStore } from 'react-redux'

import { nodePropTypes } from '../../graph/node'

// function ArrowChoices(props) {
//   return null
// }

export default function EndPoints(props) {
  const [node1, node2] = props.nodes

  return <div className="select-endpoints">
           <div>
             <select>
               <option>{node1.name}</option>
               <option>{node2.name}</option>
             </select>
           </div>
         </div>
}

EndPoints.propTypes = {
  nodes: PropTypes.arrayOf(nodePropTypes)
}
