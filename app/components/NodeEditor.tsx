import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import EditorHeader from './EditorHeader'
import SizePicker from './SizePicker'
import EditNodeColorPage from './EditNodeColorPage'
import NodeStyleForm from './NodeStyleForm'
import EditorSubmitButtons from './EditorSubmitButtons'
import EditorHotKeys from './EditorHotKeys'
import { callWithTargetValue, isLittleSisId } from '../util/helpers'
import { IoIosLink } from '@react-icons/all-files/io/IoIosLink'
import { NodeAttributes } from '../graph/node'

type NodeEditorMainPagePropTypes = {
  node: {
    id: string,
    name?: string,
    description?: string,
    image?: string,
    url?: string
  },
  setPage: (page: string) => void,
  updateNode: (node: NodeAttributes) => void,
  openAddConnections: () => void
}

export function MainPage({ node, setPage, updateNode, openAddConnections }: NodeEditorMainPagePropTypes) {
  const isLsNode = isLittleSisId(node.id)

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
      { isLsNode &&
        <a className="add-connections-link" onClick={openAddConnections}>Add Connections +</a>
      }
    </>
  )
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
  const isLsNode = isLittleSisId(id)

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
          { isLsNode &&
            <div title={`LittleSis Entity ID: ${id}`} className="node-littlesis-link"><IoIosLink /></div>
          }

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
