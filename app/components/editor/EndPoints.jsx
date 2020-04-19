import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Arrow from '../../graph/arrow'
import Node from '../../graph/node'

export default function EndPoints(props) {
  const [selected, select] = useState("1")

  const [arrow, setArrow] = useState(props.arrow)

  const selectNode = event => select(event.target.value)

  const pickArrow = event => {
    const addArrow = event.target.value === 'true'
    const updatedArrow = Arrow.change({ arrow, addArrow, selected })
    setArrow(updatedArrow)
    props.updateArrow(updatedArrow)
  }

  const arrowState = Arrow.parse(arrow)[`node${selected}`].toString()

 //const selectedNode = props.nodes[toNumber(selected) - 1]

  return (
    <div className="select-endpoints">
      <div>
        <select value={selected} onChange={selectNode} >
          <option value="1">{props.nodes[0].name}</option>
          <option value="2">{props.nodes[1].name}</option>
        </select>

        <select value={arrowState} onChange={pickArrow}>
          <option value="true">---&gt;</option>
          <option value="false">----</option>
        </select>
      </div>
    </div>
  )
}

EndPoints.propTypes = {
  nodes: Node.types.arrayOfNodes.isRequired,
  arrow: PropTypes.string,
  updateArrow: PropTypes.func.isRequired
}
