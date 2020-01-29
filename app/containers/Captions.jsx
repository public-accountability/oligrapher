import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Caption from './Caption'

export function Captions({captionIds}) {
  return <g className="captions">
           { captionIds.map(id => <Caption key={id} id={id} />) }
         </g>
}


Captions.propTypes = {
  captionIds: PropTypes.arrayOf(PropTypes.string).isRequired
}

const mapStateToProps = state => ({
  captionIds: Object.keys(state.graph.captions)
})

export default connect(mapStateToProps)(Captions)
