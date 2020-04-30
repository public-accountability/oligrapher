import React from 'react'
import PropTypes from 'prop-types'

export default function EdgeCreationMessage({ nodes }) { 
  return (
    <div className='oligrapher-edge-creation-message'>Create new edge between {nodes[0].name} and {nodes[1].name}</div >
  ) 
}

EdgeCreationMessage.propTypes = {
  nodes: PropTypes.array.isRequired
}