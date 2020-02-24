import React from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'

import EditMenu from '../components/editor/EditMenu'

export default function StyleNodesMenu(props) {
  return <EditMenu tool="style">
           <main>
             <input type="url"
                    placeholder="image url"
                    onChange={noop}/>
             <hr />

           </main>
         </EditMenu>

}


StyleNodesMenu.propTypes = {}
