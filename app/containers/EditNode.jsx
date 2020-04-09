import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import curry from 'lodash/curry'
import noop from 'lodash/noop'
import omit from 'lodash/omit'
import { createStateUpdater, isLittleSisId } from '../util/helpers'

import Node from '../graph/node'
import SizePicker from '../components/SizePicker'
import EditNodeColorPage from '../components/editor/EditNodeColorPage'
import EditNodeBioPage from '../components/editor/EditNodeBioPage'
import NodeStyleForm from '../components/editor/NodeStyleForm'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'

export function MainPage({node, nodeUpdater, setPage, openAddConnections}) {
  return (
    <>
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
      <NodeStyleForm setPage={setPage} />
      <hr/>
      <a onClick={() => setPage('bio')}
        className="add-node-bio-link">Add Node Bio +</a>
      { openAddConnections && <a className="add-connections-link" onClick={openAddConnections}>Add Connections +</a> }
    </>

  )
}

MainPage.propTypes = {
  node: PropTypes.shape({ name: PropTypes.string,
                          image: PropTypes.string,
                          url: PropTypes.string }).isRequired,
  nodeUpdater: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  openAddConnections: PropTypes.func.isRequired
}

/*
  Changes to the node are stored as local state on this component until submitted
*/
export function EditNode(props) {
  // possible pages: main, color, size, bio
  const [page, setPage] = useState('main')
  const [node, setNode] = useState(omit(props.node, ['x', 'y', 'id']))
  const nodeUpdater = curry(createStateUpdater)(setNode)
  const handleSubmit = () => props.updateNode(props.id, node)
  const handleDelete = () => props.removeNode(props.id)

  const setScale = newScale => setNode(oldState => ({...oldState, scale: newScale }))

  return (
    <>
      <main>
        { page === 'main' && <MainPage node={node} nodeUpdater={nodeUpdater} setPage={setPage} openAddConnections={props.openAddConnections} /> }
        { page === 'color' && <EditNodeColorPage color={node.color} onChange={nodeUpdater('color')}/> }
        { page === 'size' && <SizePicker scale={node.scale} setScale={setScale} /> }
        { page === 'bio' && <EditNodeBioPage text="Placeholder node bio text" onChange={noop} /> }
      </main>

      <footer>
        <EditMenuSubmitButtons handleSubmit={handleSubmit}
                              handleDelete={handleDelete}
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
const mapStateToProps = (state, ownProps) => {
  return {
    node: state.graph.nodes[ownProps.id]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateNode: (attributes) => dispatch({type: "UPDATE_NODE", id: ownProps.id, attributes }),
  removeNode: () => dispatch({ type: "REMOVE_NODE", id: ownProps.id }),
  openAddConnections: isLittleSisId(ownProps.id) ? () => dispatch({ type: "OPEN_ADD_CONNECTIONS_MENU", id: ownProps.id }) : null
})

export default connect(mapStateToProps, mapDispatchToProps)(EditNode)
