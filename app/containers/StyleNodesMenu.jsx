import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
//import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import curry from 'lodash/curry'

import { createStateUpdater } from '../util/helpers'

import EditMenu from '../components/editor/EditMenu'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import EditNodeColorPage from '../components/editor/EditNodeColorPage'
import NodeStyleForm from '../components/editor/NodeStyleForm'
import SizePicker from '../components/SizePicker'

// This prevents accidentally remove image urls from all selected nodes
function prepareAttributes(attributes) {
  return attributes?.image === '' ? omit(attributes, 'image') : attributes
}

// This tool allows multiple nodes to be styled at the same time
// It's similar to <EditNodeMenu>
export default function StyleNodesMenu() {
  const dispatch = useDispatch()
  const [attributes, setAttributes] = useState({})
  const [page, setPage] = useState('main')

  const handleSubmit = () => dispatch({ type: 'UPDATE_NODES', attributes: prepareAttributes(attributes) })
  const attributesUpdater = curry(createStateUpdater)(setAttributes)

  return <EditMenu tool="style">
           <main>
             {
               page === 'main' && <>
                                    <input type="url" value={attributes.image} placeholder="image url" onChange={attributesUpdater('image')}/>
                                    <hr />
                                    <NodeStyleForm setPage={setPage} />
                                    <hr />
                                  </> }


             { page === 'color' && <EditNodeColorPage color={attributes.color || '#ccc'} onChange={attributesUpdater('color')} /> }
             { page === 'size' && <SizePicker scale={attributes.scale || 1} setScale={attributesUpdater('scale')} /> }
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit}
                                    hideDeleteButton={true}
                                    page={page}
                                    setPage={setPage} />
           </footer>
         </EditMenu>
}
