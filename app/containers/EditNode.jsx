import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import Node from '../graph/node'
import SizePicker from '../components/SizePicker'
import EditNodeColorPage from '../components/editor/EditNodeColorPage'
import EditNodeBioPage from '../components/editor/EditNodeBioPage'
import NodeStyleForm from '../components/editor/NodeStyleForm'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import { callWithTargetValue, isLittleSisId } from '../util/helpers'

export function MainPage({node, setPage, updateNode, openAddConnections}) {
  const showAddConnections = isLittleSisId(node.id)
  console.log(node)

  return (
    <>
      <form>
        <div>
          <label>Title</label>
          <input type="text"
                placeholder="node title"
                value={node.name || ''}
                onChange={callWithTargetValue(name => updateNode({ name }))} />
        </div>

        <div>
          <label>Image Link</label>
          <input type="text"
                placeholder="Image link"
                value={node.image || ''}
                onChange={callWithTargetValue(image => updateNode({ image }))} />
        </div>

        <div>
          <label>Clickthrough Link</label>
          <input type="text"
                placeholder="Link"
                value={node.url || ''}
                onChange={callWithTargetValue(url => updateNode({ url }))} />
        </div>
      </form>
      <hr/>
      <NodeStyleForm setPage={setPage} />
      <hr/>
      <a onClick={() => setPage('bio')}
        className="add-node-bio-link">Add Node Bio +</a>
      { showAddConnections && <a className="add-connections-link" onClick={openAddConnections}>Add Connections +</a> }
    </>

  )
}

MainPage.propTypes = {
  node: PropTypes.shape({ 
    id: PropTypes.any,
    name: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string 
  }).isRequired,
  setPage: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  openAddConnections: PropTypes.func.isRequired
}

export default function EditNode({ id }) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')
  const dispatch = useDispatch()
  const node = useSelector(state => state.graph.nodes[id])
  const removeNode = () => dispatch({ type: "REMOVE_NODE", id })
  const updateNode = (attributes) => dispatch({ type: "UPDATE_NODE", id, attributes })
  const { x, y, actualZoom } = node
  const openAddConnections = () => dispatch({ type: "OPEN_ADD_CONNECTIONS_MENU", id, x, y, actualZoom })

  return (
    <>
      <main>
        { page === 'main' && <MainPage node={node} setPage={setPage} updateNode={updateNode} openAddConnections={openAddConnections} /> }
        { page === 'color' && <EditNodeColorPage color={node.color} updateNode={updateNode}/> }
        { page === 'size' && <SizePicker scale={node.scale} updateNode={updateNode} /> }
        { page === 'bio' && <EditNodeBioPage text="Placeholder node bio text" updateNode={updateNode} /> }
      </main>

      <footer>
        <EditMenuSubmitButtons
          handleDelete={removeNode}
          page={page}
          setPage={setPage} />
      </footer>
    </>
  )
}

EditNode.propTypes = {
  id: PropTypes.string.isRequired,
  node: Node.types.node.isRequired,
  updateNode: PropTypes.func.isRequired,
  removeNode: PropTypes.func.isRequired,
  openAddConnections: PropTypes.func.isRequired
}