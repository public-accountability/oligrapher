import React, { Component } from 'react'
import { connect } from 'react-redux'

export class Annotations extends Component {
  render () {
    return <h1>annotations</h1>
  }
}

export function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Root)
