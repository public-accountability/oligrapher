import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GraphContainer from '../components/graph/GraphContainer'
import Edges from './Edges'
import Nodes from './Nodes'
import Pannable from '../components/graph/Pannable'
import Zoomable from '../components/graph/Zoomable'

// import Graph from '../components/graph/Graph'
// <Nodes />
// <Edges />
export function Graph(props) {
  let zoom = 1

  return <GraphContainer viewBox={props.viewBox} height="100%">
             <Zoomable zoom={zoom}>
               <Pannable zoom={zoom }>
                 <Nodes />
                 <Edges />
                 { /* <Captions /> */ }
               </Pannable>
             </Zoomable>
         </GraphContainer>
}


Graph.propTypes = {
  viewBox: PropTypes.object.isRequired
}

const mapStateToProps = function(state) {
  return { viewBox: state.graph.viewBox }
}

export default connect(mapStateToProps)(Graph)


/*

|div
| _____
| | Svg
| |
| |
|
|

// <circle stroke="red" cx="200" cy="200" r="50px"></circle>

*/
