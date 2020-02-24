import React, { useState } from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'

import EditMenu from '../components/editor/EditMenu'
import NodeStyleForm from '../components/editor/NodeStyleForm'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'

export default function StyleNodesMenu(props) {
  const [page, setPage] = useState('main')

  const handleSubmit = () => console.log("handleSubmit() for StyleNodesMenu")
  const handleDelete = () => console.log("handleDelete() from StyleNodesMenu")

  return <EditMenu tool="style">
           <main>
             <input type="url"
                    placeholder="image url"
                    onChange={noop}/>
             <hr />
             { page === 'main' && <NodeStyleForm setPage={setPage} />}
             <hr />
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit}
                                    handleDelete={handleDelete}
                                    page={page}
                                    setPage={setPage} />
           </footer>

         </EditMenu>

}


 StyleNodesMenu.propTypes = {}
