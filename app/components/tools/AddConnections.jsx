import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import isArray from 'lodash/isArray'

import { findConnections, getRelationship } from '../../datasources/littlesis3'
import { makeCancelable } from '../../util/helpers'
import EntitySearchResults from './EntitySearchResults'
import Graph from '../../graph/graph'

/*
  This is the "Add Connections" popup.
  It uses LittleSis /api/entities/:id/connections
  routes to get a list of connected entities.

  The results component is <AddConnectionsResults>
*/
export default function AddConnections({ id }) {
  const graph = useSelector(state => state.graph)
  const connectedNodeIds = useMemo(() => Graph.connectedNodeIds(graph, id), [graph, id])
  const dispatch = useDispatch()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  const addConnection = useCallback(node => {
    dispatch({ type: 'ADD_CONNECTION', existingNodeId: id, newNode: node, newEdge: node.edge })
  }, [dispatch, id])

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(findConnections(id))

    httpRequest
      .promise
      .then(entities => {
        let results = uniqBy(entities, 'id').filter(entity => !connectedNodeIds.includes(entity.id))
        
        setResults(results) // ..Until we figure out the best way handle the case where there are multiple relationship between the same entity
        setLoading(false)
      })
      .catch(err => {
        if (!err.isCanceled) {
          console.error("Error finding connections", err)
          setResults(false)
          setLoading(false)
        }
      })

    return httpRequest.cancel
  }, [id, connectedNodeIds])

  if (loading) {
    return <em>...loading...</em>
  } else if (isArray(results)) {
    if (results.length > 0) {
      return <EntitySearchResults results={results} onClick={addConnection} />
    } else {
      return <em>No results.</em>
    }
  } else {
    return <em>Your search resulted in an error.</em>
  }
}

AddConnections.propTypes = {
  id: PropTypes.number.isRequired
}
