import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
// import Story form './Story'

/*
  This is the root container

  Oligrapher has 3 three components

   _ _ _ _ _ _ _ _
  |   header      |
  |_ _ _ _ _ _ _  |
  |       |       |
  | graph | story |
  |       |       |


*/
export class Root extends Component {
  render() {
    return <div id="oligrapher-container">
             <Header />
             <Graph />
             <Editor />
           </div>
  }
}

export default connect()(Root)
