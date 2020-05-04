import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import EditorHeader from '../components/editor/EditorHeader'
import SizePicker from '../components/SizePicker'
import EditNodeColorPage from '../components/editor/EditNodeColorPage'
import EditNodeBioPage from '../components/editor/EditNodeBioPage'
import NodeStyleForm from '../components/editor/NodeStyleForm'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import EditorHotKeys from '../components/EditorHotKeys'
import { callWithTargetValue, isLittleSisId } from '../util/helpers'

export function MainPage({ node, setPage, updateNode, openAddConnections }) {
  const showAddConnections = isLittleSisId(node.id)

  return (
    <>
      <form>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Node name"
            value={node.name || ''}
            onChange={callWithTargetValue(name => updateNode({ name }))} />
        </div>

        <div>
          <label>Image Link</label>
          <input
            type="text"
            placeholder="Image link"
            value={node.image || ''}
            onChange={callWithTargetValue(image => updateNode({ image }))} />
        </div>

        <div>
          <label>Clickthrough Link</label>
          <input
            type="text"
            placeholder="Link"
            value={node.url || ''}
            onChange={callWithTargetValue(url => updateNode({ url }))} />
        </div>
      </form>
      <hr/>
      <NodeStyleForm setPage={setPage} />
      <hr/>
      { showAddConnections &&
        <a className="add-connections-link" onClick={openAddConnections}>Add Connections +</a>
      }
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

export default function NodeEditor({ id }) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')

  const node = useSelector(state => state.graph.nodes[id])

  const dispatch = useDispatch()
  const removeNode = () => dispatch({ type: 'REMOVE_NODE', id })
  const updateNode = (attributes) => dispatch({ type: 'UPDATE_NODE', id, attributes })
  const openAddConnections = () => dispatch({ type: 'OPEN_ADD_CONNECTIONS', id })

  return (
    <EditorHotKeys remove={removeNode}>
      <div className="oligrapher-node-editor">
        <EditorHeader title="Customize Node" />
        <main>
          { page === 'main' && <MainPage node={node} setPage={setPage} updateNode={updateNode} openAddConnections={openAddConnections} /> }
          { page === 'color' && <EditNodeColorPage color={node.color} updateNode={updateNode}/> }
          { page === 'size' && <SizePicker scale={node.scale} updateNode={updateNode} /> }
          { page === 'bio' && <EditNodeBioPage text="Placeholder node bio text" updateNode={updateNode} /> }
        </main>

        <footer>
          <EditMenuSubmitButtons
            hideSubmitButton={true}
            handleDelete={removeNode}
            page={page}
            setPage={setPage} />
        </footer>
      </div>
    </EditorHotKeys>
  )
}

NodeEditor.propTypes = {
  id: PropTypes.string.isRequired
}