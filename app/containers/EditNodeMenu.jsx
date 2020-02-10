import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Node from '../graph/node'
import omit from 'lodash/omit'
import curry from 'lodash/curry'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isNil from 'lodash/isNil'

import SizePicker from '../components/SizePicker'
import EditNodeColorPage from '../components/editor/EditNodeColorPage'
import CustomizeButton from '../components/editor/CustomizeButton'
import EditMenu from '../components/editor/EditMenu'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'

// whatever-func-useState()-returns, string ---> function(event)
function updateNodeFunc(setNode, attributeName) {
  return function(eventOrValue) {
    if (isString(eventOrValue) || isNumber(eventOrValue) || isNil(eventOrValue.target)) {
      setNode(oldState => ({...oldState, [attributeName]: eventOrValue}))
    } else {
      let value = eventOrValue.target.value
      setNode(oldState => ({...oldState, [attributeName]: value}))
    }
  }
}

function styleForm(setPage) {
  return <div className="style-form">
           <div>Style</div>
           <div>
             <CustomizeButton icon="size" onClick={() => setPage('size')} />
             <CustomizeButton icon="color" onClick={() => setPage('color')} />
             <CustomizeButton icon="shapes" onClick={() => console.error('Shapes not yet implemented')}  />
           </div>
         </div>
}


export function MainPage({node, nodeUpdater, setPage}) {
  return <>
           <form>
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
           <hr/>
           {styleForm(setPage)}
           <hr/>
           <a onClick={() => setPage('bio')}
              className="add-node-bio-link">Add Node Bio +</a>
         </>
}

MainPage.propTypes = {
  node: PropTypes.shape({ name: PropTypes.string,
                          image: PropTypes.string,
                          url: PropTypes.string }).isRequired,
  nodeUpdater: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
}

function bioPage() { return "BIO PAGE" }

/*
  Changes to the node are stored as local state on this component until submitted
*/
export function EditNodeMenuBody(props) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')
  const [node, setNode] = useState(omit(props.node, ['x', 'y', 'id']))
  const nodeUpdater = curry(updateNodeFunc)(setNode)
  const handleSubmit = () => props.updateNode(props.id, node)
  const handleDelete = () => console.log(`deleting node ${props.id}`)

  const setScale = newScale => setNode(oldState => ({...oldState, scale: newScale }))

  return <>
           <main>
             { page === 'main' && <MainPage node={node} nodeUpdater={nodeUpdater} setPage={setPage} /> }
             { page === 'color' && <EditNodeColorPage color={node.color} onChange={nodeUpdater('color')}/> }
             { page === 'size' && <SizePicker scale={node.scale} setScale={setScale} /> }
             { page === 'bio' && bioPage() }
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit}
                                    handleDelete={handleDelete}
                                    page={page}
                                    setPage={setPage} />
           </footer>

         </>
}

EditNodeMenuBody.propTypes = {
  id: PropTypes.string.isRequired,
  node: Node.types.node.isRequired,
  updateNode: PropTypes.func.isRequired
}

/*
  The menu for Editing a node. Rendered in <root>

  This component is a simple wrapper around EditNodeMenuBody.
  The "key" property on <EditNodeMenuBody> is important: it ensures that
  <EditNodeMenuBody /> is re-created when a different node is selected.
*/
export function EditNodeMenu(props) {
  return <EditMenu tool="node">
           <EditNodeMenuBody {...props} key={props.id} />
         </EditMenu>
}

EditNodeMenu.propTypes = {
  id: PropTypes.string,
  node: Node.types.node.isRequired,
  updateNode: PropTypes.func.isRequired
}


const mapStateToProps = state => {
  return {
    id: state.display.editor.editNode,
    node: state.graph.nodes[state.display.editor.editNode]
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateNode: (id, attributes) => dispatch({type: "UPDATE_NODE", id, attributes })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditNodeMenu)
