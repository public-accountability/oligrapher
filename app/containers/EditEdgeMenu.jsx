import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pick from 'lodash/pick'
import merge from 'lodash/merge'

import Graph from '../graph/graph'
import Edge from '../graph/edge'
import Node from '../graph/node'

// Components
import EditMenu from '../components/editor/EditMenu'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import LineStyle from '../components/editor/LineStyle'
import DashStyle from '../components/editor/DashStyle'

const labelForm = (label, updateLabel) => (
  <form>
    <div>
      <label>Title</label>
      <input type="text"
             placeholder="label"
             value={label}
             onChange={ evt => updateLabel(evt.target.value) } />
    </div>
  </form>)

const urlForm = (url, updateUrl) => (
  <form>
    <div>
      <label>Clickthrough link</label>
      <input type="url"
             placeholder="Clickthrough link"
             value={url}
             onChange={ evt => updateUrl(evt.target.value) } />
    </div>
  </form>
)

// Object, Func => Func(String) => Func(Any) => setAttributes() call
const createAttributeUpdator = (attributes, setAttributes) => name => value => setAttributes(merge({}, attributes, { [name]: value }))
const edgeAttributes = edge => pick(edge, 'label', 'size', 'color', 'url', 'arrow')

export function EditEdgeMenu(props)  {
  const [attributes, setAttributes] = useState(edgeAttributes(props.edge))
  const attributeUpdator = createAttributeUpdator(attributes, setAttributes)
  const updateLabel = attributeUpdator('label')
  const updateUrl = attributeUpdator('url')
  const updateArrow = attributeUpdator('arrow')
  const updateDash = attributeUpdator('dash')

  useEffect(() => {
    setAttributes( prevEdge => ({ ...prevEdge, ...edgeAttributes(props.edge) }))
  }, [props.id, props.edge.label, props.edge.size, props.edge.color, props.edge.url, props.edge.arrow] )

  const handleSubmit = () => props.updateEdge(props.id, attributes)
  const handleDelete = () => console.log(`deleting edge ${props.id}`)

  return <EditMenu tool="edge">
           <main>
             { labelForm(attributes.label, updateLabel) }
             <hr />
             <LineStyle nodes={props.nodes} updateArrow={updateArrow} />
             <DashStyle onChange={updateDash} dash={props.edge.dash}/>
             <hr />
             { urlForm(attributes.url, updateUrl) }
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit} handleDelete={handleDelete} page="main"/>
           </footer>
         </EditMenu>
}

EditEdgeMenu.propTypes = {
  id: PropTypes.string.isRequired,
  edge: Edge.types.edge.isRequired,
  nodes: Node.types.arrayOfNodes.isRequired,
  updateEdge: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const edgeId = state.display.editor.editEdge.toString()

  return {
    id: edgeId,
    edge: state.graph.edges[edgeId],
    nodes: Graph.nodesOf(state.graph, edgeId)
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateEdge: (id, attributes) => dispatch({type: "UPDATE_EDGE", id, attributes })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEdgeMenu)
