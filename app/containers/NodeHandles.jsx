import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import add from 'lodash/add'
import subtract from 'lodash/subtract'

import NodeHandle from '../components/graph/NodeHandle'

export default function NodeHandles(props) {
  const dispatch = useDispatch()

  const openEditNodeMenu = useCallback(
    () => dispatch({ type: 'OPEN_EDIT_NODE_MENU', id: props.id }),
    [dispatch, props.id]
  )

  const openAddConnectionsMenu = useCallback(
    () => dispatch({ type: 'OPEN_ADD_CONNECTIONS_MENU', id: props.id }),
    [dispatch, props.id]
  )

  return <>
           <NodeHandle side="left"
                       x={subtract(props.x, props.radius)}
                       y={props.y}
                       action={openAddConnectionsMenu} />
           <NodeHandle side="right"
                       x={add(props.x, props.radius)}
                       y={props.y}
                       action={openEditNodeMenu} />
         </>
}

NodeHandles.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired
}
