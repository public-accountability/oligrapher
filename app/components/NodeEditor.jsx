import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { useSelector } from '../util/helpers'
import EditorHeader from './EditorHeader'
import SizePicker from './SizePicker'
import EditNodeColorPage from './EditNodeColorPage'
import NodeStyleForm from './NodeStyleForm'
import EditorSubmitButtons from './EditorSubmitButtons'
import EditorHotKeys from './EditorHotKeys'
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
          <label>Hover-Over Description</label>
          <input
            type="text"
            placeholder="Description"
            value={node.description || ''}
            onChange={callWithTargetValue(description => updateNode({ description }))} />
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
    description: PropTypes.string,
    image: PropTypes.string,
    url: PropTypes.string 
  }).isRequired,
  setPage: PropTypes.func.isRequired,
  updateNode: PropTypes.func.isRequired,
  openAddConnections: PropTypes.func.isRequired
}

export default function NodeEditor({ id }) {
  // possible pages: main, color, size
  const [page, setPage] = useState('main')
  const node = useSelector(state => state.graph.nodes[id])
  const colors = useSelector(state => Object.values(state.graph.nodes).map(node => node.color))

  const dispatch = useDispatch()
  const removeNode = useCallback(() => dispatch({ type: 'REMOVE_NODE', id }), [dispatch, id])
  const updateNode = useCallback(attributes => dispatch({ type: 'UPDATE_NODE', id, attributes }), [dispatch, id])
  const handleColorChange = useCallback(color => updateNode({ color }), [updateNode])
  const handleScaleChange = useCallback(scale => updateNode({ scale }), [updateNode])
  const openAddConnections = () => dispatch({ type: 'OPEN_ADD_CONNECTIONS', id })

  return (
    <EditorHotKeys remove={removeNode}>
      <div className="oligrapher-node-editor">
        <EditorHeader title="Customize Node" />
        <main>
          { page === 'main' && <MainPage node={node} setPage={setPage} updateNode={updateNode} openAddConnections={openAddConnections} /> }
          { page === 'color' && <EditNodeColorPage color={node.color} onChange={handleColorChange} colors={colors} /> }
          { page === 'size' && <SizePicker scale={node.scale} onChange={handleScaleChange} /> }
        </main>

        <footer>
          <EditorSubmitButtons
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