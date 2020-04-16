import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import isArray from 'lodash/isArray'

import { findConnections, getEdges } from '../../datasources/littlesis3'
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
  const dispatch = useDispatch()
  const graph = useSelector(state => state.graph)
  const connectedNodeIds = useMemo(() => Graph.connectedNodeIds(graph, id), [graph, id])
  const allNodeIds = Object.keys(graph.nodes)
  const addEdges = useSelector(state => state.settings.automaticallyAddEdges)
  const [addedNodeIds, setAddedNodeIds] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const excludeIds = addedNodeIds.concat(connectedNodeIds)
  const visibleResults = isArray(results) 
    ? results.filter(entity => !excludeIds.includes(entity['id']))
    : null

  const addConnection = useCallback(node => {
    dispatch({ type: 'ADD_CONNECTION', existingNodeId: id, newNode: node, newEdge: node.edge })
    setAddedNodeIds(addedNodeIds.concat([node.id]))

    if (!addEdges || !allNodeIds) {
      return
    }

    getEdges(node.id, allNodeIds)
    .then(json => {
      if (json.length > 0) {
        dispatch({ type: 'ADD_EDGES', edges: json })
      }
    })
    .catch(err => {
      console.error("Couldn't add edges for new node:", err)
    })
  }, [id, dispatch, addedNodeIds, allNodeIds, addEdges])

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(findConnections(parseInt(id)))

    httpRequest
      .promise
      .then(entities => {
        let results = uniqBy(entities, 'id')
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
  }, [id])

  // only show loading indicator if there aren't already results
  if (loading && !isArray(results)) {
    return <em>...loading...</em>
  } else if (isArray(visibleResults)) {
    if (visibleResults.length > 0) {
      return <EntitySearchResults results={visibleResults} onClick={addConnection} />
    } else {
      return <em>No results.</em>
    }
  } else {
    return <em>Your search resulted in an error.</em>
  }
}

AddConnections.propTypes = {
  id: PropTypes.string.isRequired
}
