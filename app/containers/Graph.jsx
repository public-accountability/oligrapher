import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'


export class Graph extends Component {
  render () {
    return <div id="oligrapher-graph">
           </div>
  }
}


// const mapStateToProps = function(state) {}

export default connect()(Graph)
