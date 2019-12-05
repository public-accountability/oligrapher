import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
// import Story form './Story'

/*
  This is the root container

  Oligrapher's layout can be divided into three components

   _ _ _ _ _ _ _ _
  |   header      |
  |_ _ _ _ _ _ _  |
  |       |       |
  | graph | story |
  |       |       |

  Graph is divided into the visuals (<Graph>) and editing interface (<Editor>)

*/
export class Root extends Component {
  render() {
    return <div id="oligrapher-container">
             <Header />
             <div className="oligrapher-graph-container">
               <Graph />
               <Editor />
             </div>
           </div>
  }
}

export default connect()(Root)
