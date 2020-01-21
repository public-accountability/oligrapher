import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pick from 'lodash/pick'
import merge from 'lodash/merge'

import Graph from '../graph/graph'
import { edgePropTypes } from '../graph/edge'
import { nodePropTypes } from '../graph/node'

// Components
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import LineStyle from '../components/editor/LineStyle'

const labelForm = (label, setLabel) => (
  <form>
    <div>
      <label>Title</label>
      <input type="text"
             placeholder="label"
             value={label}
             onChange={ evt => setLabel(evt.target.value) } />
    </div>
  </form>)

const urlForm = (url, setUrl) => (
  <form>
    <div>
      <label>Clickthrough link</label>
      <input type="url"
             placeholder="Clickthrough link"
             value={url}
             onChange={ evt => setUrl(evt.target.value) } />
    </div>
  </form>

)


// Object, Func => Func(String) => Func(Any) => setAttributes() call
const attributeUpdator = (attributes, setAttributes) => name => value => setAttributes(merge({}, attributes, { [name]: value }))
const propsToAttributes = props => pick(props.edge, 'label', 'size', 'color', 'url')

export function EditEdgeMenu(props)  {
  const [attributes, setAttributes] = useState(propsToAttributes(props))
  const updator = attributeUpdator(attributes, setAttributes)
  const setLabel = updator('label')
  const setUrl = updator('url')

  useEffect(() => {
    setAttributes( prevEdge => ({ ...prevEdge, ...propsToAttributes(props) }))
  }, [props.id, props.edge.label, props.edge.size, props.edge.color, props.edge.url] )

  const handleSubmit = () => props.updateEdge(props.edge.id, attributes)
  const handleDelete = () => console.log(`deleting edge ${props.id}`)

  return <div className="oligrapher-edit-edge-menu">
           <div className="edit-edge-menu-wrapper">
             <header>Customize Edge</header>

             <main>
               { labelForm(attributes.label, setLabel) }
               <hr />
               <LineStyle nodes={props.nodes}/>
               <hr />
               { urlForm(attributes.url, setUrl) }
             </main>

             <footer>
               <EditMenuSubmitButtons handleSubmit={handleSubmit} handleDelete={handleDelete} />
             </footer>
           </div>
         </div>

}

EditEdgeMenu.propTypes = {
  id: PropTypes.string.isRequired,
  edge: PropTypes.shape(edgePropTypes),
  nodes: PropTypes.arrayOf(nodePropTypes),
  updateEdge: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const id = state.display.editor.editEdge

  return {
    id: id,
    edge: state.graph.edges[id],
    nodes: Graph.nodesOf(state.graph, id)
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateEdge: (id, attributes) => dispatch({type: "UPDATE_EDGE", id, attributes })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEdgeMenu)
