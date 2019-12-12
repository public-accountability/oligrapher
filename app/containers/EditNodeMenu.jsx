import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getNode } from '../graph/graph'
import { inPortal } from '../util/render'

import omit from 'lodash/omit'
import curry from 'lodash/curry'




// whatever-func-useState()-returns, string ---> function(event)
function updateNode(setNode, attributeName) {
  return function(event) {
    const value = event.target.value
    setNode(oldState => ({...oldState, [attributeName]: value}))
  }
}

// A form with input fields for node name, image url, and clickthrough link
function mainPage(node, nodeUpdater) {
  return <form className="oligrapher-edit-node-menu-form">
           <div>
             <label>Title</label>
             <input type="text"
                    placeholder="node title"
                    value={node.name || ''}
                    onChange={nodeUpdater('name')} />
           </div>

           <div>
             <label>Image Link</label>
             <input type="text"
                    placeholder="Image link"
                    value={node.image || ''}
                    onChange={nodeUpdater('image')} />
           </div>

           <div>
             <label>Clickthrough Link</label>
             <input type="text"
                    placeholder="Link"
                    value={node.url || ''}
                    onChange={nodeUpdater('url')} />
           </div>
         </form>
}

function colorPage() {}
function sizePage() {}
function bioPage() {}

export function EditNodeMenu(props) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')
  const [node, setNode] = useState(omit(props, ['x', 'y', 'id']))
  const nodeUpdater = curry(updateNode)(setNode)


  return <div className="edit-node-menu">
           <header>Edit & Customize Node</header>
           { page === 'main' && mainPage(node, nodeUpdater) }
           { page === 'color' && colorPage() }
           { page === 'size' && sizePage() }
           { page === 'bio' && bioPage() }
           <footer>
             {/* SUBMIT and CANCEL BUTTONS */}
           </footer>
         </div>


}

EditNodeMenu.propTypes = {
  name: PropTypes.string
}

const mapStateToProps = state => {
  return getNode(state.graph, state.display.editor.editNode)
}

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { areStatePropsEqual: Object.is }
)(inPortal(EditNodeMenu, "oligrapher-edit-node-menu"))
