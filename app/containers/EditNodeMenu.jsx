import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getNode } from '../graph/graph'
import { inPortal } from '../util/render'
import omit from 'lodash/omit'
import curry from 'lodash/curry'

import { MdPhotoSizeSelectSmall, MdFormatColorFill } from "react-icons/md"
import { FaShapes } from "react-icons/fa"

// whatever-func-useState()-returns, string ---> function(event)
function updateNodeFunc(setNode, attributeName) {
  return function(event) {
    const value = event.target.value
    setNode(oldState => ({...oldState, [attributeName]: value}))
  }
}

// A form with input fields for node name, image url, and clickthrough link
function nodeAttributeForm(node, nodeUpdater) {
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

function styleForm() {
  return <div className="edit-node-style-buttons">
           <h6>Style</h6>
           <div className="edit-node-style-button">
             <MdPhotoSizeSelectSmall/>
           </div>
           <div className="edit-node-style-button">
             <MdFormatColorFill/>
           </div>
           <div className="edit-node-style-button">
             <FaShapes/>
           </div>
         </div>
}

function nodeBioLink() {
  return <a>Add Node Bio +</a>
}

function mainPage(node, nodeUpdater) {
  return <>
           { nodeAttributeForm(node, nodeUpdater) }
           <hr/>
           { styleForm() }
           <hr/>
           { nodeBioLink() }
         </>

}

function colorPage() {
  return "COLOR PAGE"
}

function sizePage() {
  return "SIZE PAGE"
}

function bioPage() {
  return "BIO PAGE"
}

function buttons({handleSubmit, handleDelete}) {
  return <div className="edit-node-menu-submit-buttons">
           <button name="delete" onClick={handleDelete}>Delete</button>
           <button name="update" onClick={handleSubmit}>Update</button>
         </div>
}

export function EditNodeMenu(props) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')
  const [node, setNode] = useState(omit(props, ['x', 'y', 'id']))
  const nodeUpdater = curry(updateNodeFunc)(setNode)
  const handleSubmit = () => props.updateNode(props.id, node)
  const handleDelete = () => console.log(`deleting node ${props.id}`)

  return <div className="edit-node-menu">
           <header>Edit & Customize Node</header>
           <main>
             { page === 'main' && mainPage(node, nodeUpdater) }
             { page === 'color' && colorPage() }
             { page === 'size' && sizePage() }
             { page === 'bio' && bioPage() }
             </main>
           <footer>
             { buttons({handleSubmit, handleDelete}) }
           </footer>
         </div>
}

EditNodeMenu.propTypes = {
  name: PropTypes.string
}

const mapStateToProps = state => {
  return getNode(state.graph, state.display.editor.editNode)
}

const mapDispatchToProps = (dispatch) => ({
  updateNode: (id, attributes) => dispatch({type: "UPDATE_NODE", id, attributes })
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { areStatePropsEqual: Object.is }
)(inPortal(EditNodeMenu, "oligrapher-edit-node-menu"))
