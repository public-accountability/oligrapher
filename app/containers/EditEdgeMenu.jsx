import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import pick from 'lodash/pick'
import merge from 'lodash/merge'

import Graph from '../graph/graph'
import Edge from '../graph/edge'
import Node from '../graph/node'

import { callWithTargetValue } from '../util/helpers'

// Components
import EditMenu from '../components/editor/EditMenu'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import LineStyle from '../components/editor/LineStyle'
import DashStyle from '../components/editor/DashStyle'
import ScaleStyle from '../components/editor/ScaleStyle'

function MainPage({ nodes, attributes, attributeUpdator, setPage }) {
  const updateLabel = attributeUpdator('label')
  const updateUrl = attributeUpdator('url')
  const updateArrow = attributeUpdator('arrow')
  const updateDash = attributeUpdator('dash')
  const updateScale = attributeUpdator('scale')

  return <>
           <form>
             <div>
               <label>Title</label>
               <input type="text"
                      placeholder="label"
                      value={attributes.label}
                      onChange={ evt => updateLabel(evt.target.value) } />
             </div>
           </form>

           <hr />

           <div>
             <label>Line Style</label>
           </div>

           <div className="line-style-wrapper">
             <div>
               <div>
                 <label>End points</label>
                 <LineStyle nodes={nodes} updateArrow={updateArrow} />
               </div>

               <div>
                 <label>Dash</label>
                 <DashStyle onChange={updateDash} dash={attributes.dash} />
               </div>
             </div>

             <div>
               <div>
                 <label>Width</label>
                 <ScaleStyle updateScale={updateScale} scale={attributes.scale} />
               </div>
             </div>

           </div>

           <hr />

           <form>
             <div>
               <label>Clickthrough link</label>
               <input type="url"
                      placeholder="Clickthrough link"
                      value={attributes.url}
                      onChange={callWithTargetValue(updateUrl)} />
             </div>
           </form>
         </>
}

MainPage.propTypes = {
  nodes: PropTypes.array.isRequired,
  attributes: PropTypes.object.isRequired,
  attributeUpdator: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
}

// Object, Func => Func(String) => Func(Any) => setAttributes() call
const createAttributeUpdator = (attributes, setAttributes) => name => value => setAttributes(merge({}, attributes, { [name]: value }))
const edgeAttributes = edge => pick(edge, 'label', 'size', 'color', 'url', 'arrow', 'scale')

export function EditEdgeMenu(props)  {
  const [page, setPage] = useState('main')
  const [attributes, setAttributes] = useState(edgeAttributes(props.edge))
  const attributeUpdator = createAttributeUpdator(attributes, setAttributes)

  useEffect(() => {
    setAttributes( prevEdge => ({ ...prevEdge, ...edgeAttributes(props.edge) }))
  }, [props.id, props.edge.label, props.edge.size, props.edge.color, props.edge.url, props.edge.arrow] )

  const handleSubmit = () => props.updateEdge(props.id, attributes)
  const handleDelete = () => console.log(`deleting edge ${props.id}`)

  return <EditMenu tool="edge">
           <main>
             { page === 'main' && <MainPage attributes={attributes}
                                            attributeUpdator={attributeUpdator}
                                            setPage={setPage}
                                            nodes={props.nodes} />}
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit}
                                    handleDelete={handleDelete}
                                    page={page}
                                    setPage={setPage} />
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

const mapDispatchToProps = dispatch => ({
  updateEdge: (id, attributes) => dispatch({type: "UPDATE_EDGE", id, attributes })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEdgeMenu)
