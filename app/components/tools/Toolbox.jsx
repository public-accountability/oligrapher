import React from 'react'
import PropTypes from 'prop-types'

//  This isn't a box of tools. It's a box with one tool
export default function Toolbox({title, children}) {
  return <div className="oligrapher-toolbox">
           <header>{title}</header>
           <main>{children}</main>
         </div>
}

Toolbox.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
