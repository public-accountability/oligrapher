import React from 'react'
import PropTypes from 'prop-types'

import NodeTool from './tools/Node'

function Box(props) {
  return <div className="oligrapher-toolbox">
           <header>
             {props.title}
           </header>
           <main>
             {props.render()}
           </main>
         </div>
}

Box.propTypes = {
  title: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired
}

const tools = {
  "node": <NodeTool />
}


export default function Tool(props) {
  return <Box render={() => tools[props.name]} />
}
