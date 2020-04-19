import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import isArray from 'lodash/isArray'

import { findConnections } from '../../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../../util/helpers'
import AddConnectionsCategory from './AddConnectionsCategory'
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
  const [categoryId, setCategoryId] = useState(0)
  const [addedNodeIds, setAddedNodeIds] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const excludeIds = addedNodeIds.concat(connectedNodeIds)
  const visibleResults = isArray(results) 
    ? results.filter(entity => !excludeIds.includes(entity['id']))
    : null

  const addConnection = useCallback(node => {
    dispatch({ type: 'ADD_NODE', node })
    dispatch({ type: 'ADD_EDGE', edge: node.edge })
    setAddedNodeIds(addedNodeIds.concat([node.id]))
  }, [dispatch, addedNodeIds])

  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }))

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(findConnections(id, categoryId))

    httpRequest
      .promise
      .then(entities => {
        let results = uniqBy(entities, 'id') // ..Until we figure out the best way handle the case where there are multiple relationship between the same entity
        setResults(results)
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
  }, [id, categoryId])

  let status

  // only show loading indicator if there aren't already results
  if (loading && !isArray(results)) {
    status = <em>...loading...</em>
  } else if (isArray(visibleResults)) {
    if (visibleResults.length > 0) {
      status = <EntitySearchResults results={visibleResults} onClick={addConnection} />
    } else {
      status = <em>No results.</em>
    }
  } else {
    status = <em>Your search resulted in an error.</em>
  }

  return (
    <>
      <AddConnectionsCategory onChange={changeCategory} />
      <br />
      { status }
    </>
  )
}

AddConnections.propTypes = {
  id: PropTypes.string.isRequired
}
