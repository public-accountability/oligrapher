import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'


import toNumber from 'lodash/toNumber'

import EditMenu from '../components/editor/EditMenu'
import AddConnections from '../components/tools/AddConnections'

export default function AddConnectionsMenu() {
  const dispatch = useDispatch()
  const nodeId = useSelector(state => toNumber(state.display.floatingMenu.id))
  const addConnectionToMap = (entity, relationship) => dispatch({ type: 'ADD_CONNECTION', node: nodeId, entity, relationship })

  return <EditMenu tool="connections">
           <AddConnections entityId={nodeId} addConnectionToMap={addConnectionToMap} />
         </EditMenu>
}
