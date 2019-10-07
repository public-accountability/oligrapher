import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Graph from './Graph'

export class Root extends Component {
  render() {
    return <div id="oligrapher-container">
             <Header />
             <Graph />
           </div>
  }
}


export default connect()(Root)
