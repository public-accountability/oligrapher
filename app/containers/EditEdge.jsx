import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import pick from 'lodash/pick'
import merge from 'lodash/merge'

import Graph from '../graph/graph'

import { callWithTargetValue } from '../util/helpers'

// Components
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import LineStyle from '../components/editor/LineStyle'
import DashStyle from '../components/editor/DashStyle'
import ScaleStyle from '../components/editor/ScaleStyle'

export function MainPage({ nodes, attributes, attributeUpdator }) {
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
                      value={attributes.label || ''}
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
                      value={attributes.url || ''}
                      onChange={callWithTargetValue(updateUrl)} />
             </div>
           </form>
         </>
}

MainPage.propTypes = {
  nodes: PropTypes.array.isRequired,
  attributes: PropTypes.object.isRequired,
  attributeUpdator: PropTypes.func.isRequired
}

// Object, Func => Func(String) => Func(Any) => setAttributes() call
const createAttributeUpdator = (attributes, setAttributes) => name => value => setAttributes(merge({}, attributes, { [name]: value }))
const edgeAttributes = edge => pick(edge, 'label', 'size', 'color', 'url', 'arrow', 'scale')

export default function EditEdge({ id }) {
  const [page, setPage] = useState('main')

  const edge = useSelector(state => state.graph.edges[id])
  const nodes = useSelector(state => Graph.nodesOf(state.graph, id))

  const [attributes, setAttributes] = useState(edgeAttributes(edge))
  const attributeUpdator = createAttributeUpdator(attributes, setAttributes)

  useEffect(() => {
    setAttributes( prevEdge => ({ ...prevEdge, ...edgeAttributes(edge) }))
  }, [id, edge] )

  const dispatch = useDispatch()
  const handleSubmit = useCallback(
    () => dispatch({ type: "UPDATE_EDGE", id, attributes }),
    [dispatch, id, attributes]
  )
  const handleDelete = useCallback(
    () => dispatch({ type: "REMOVE_EDGE", id }), 
    [dispatch, id]
  )

  return (
    <div>
      <main>
        { page === 'main' && <MainPage attributes={attributes}
                                      attributeUpdator={attributeUpdator}
                                      setPage={setPage}
                                      nodes={nodes} />}
      </main>
      <footer>
        <EditMenuSubmitButtons handleSubmit={handleSubmit}
                              handleDelete={handleDelete}
                              page={page}
                              setPage={setPage} />
      </footer>
    </div>
  )
}

EditEdge.propTypes = {
  id: PropTypes.number.isRequired
}