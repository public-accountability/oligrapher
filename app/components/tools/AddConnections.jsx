import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import { findConnections } from '../../datasources/littlesis3'
import { makeCancelable } from '../../util/helpers'
import AddConnectionsResults from './AddConnectionsResults'
import Graph from '../../graph/graph'

/*
  This is the "Add Connections" popup.
  It uses LittleSis /api/entities/:id/connections
  routes to get a list of connected entities.

  The results component is <AddConnectionsResults>
*/
export default function AddConnections({ id }) {
  const dispatch = useDispatch()
  const connectedNodeIds = useSelector(state => Graph.connectedNodeIds(state.graph, id))
  console.log(connectedNodeIds)
  const [results, setResults] = useState(null)

  // This function is passed all the way down into <AddConnectionResult>
  // The setResults(filter(results)) removes the clicked on entity from the display list
  const addConnection = (entity, relationship) => {
    dispatch({ type: 'ADD_CONNECTION', node: id, entity, relationship })
  }

  useEffect(() => {
    const httpRequest = makeCancelable(findConnections(id))

    httpRequest
      .promise
      .then(json => {
        let entities = uniqBy(json['data'], 'id').filter(entity => !connectedNodeIds.includes(entity.id))
        setResults(entities) // ..Until we figure out the best way handle the case where there are multiple relationship between the same entity
      })
      .catch(err => err.isCanceled ? null : console.error("Error finding connections", err))

    return () => httpRequest.cancel()

  }, [id, connectedNodeIds])

  if (results && results.length > 0) {
    return <AddConnectionsResults results={results} addConnection={addConnection} />
  } else {
    return null
  }
}

AddConnections.propTypes = {
  id: PropTypes.number.isRequired
}
