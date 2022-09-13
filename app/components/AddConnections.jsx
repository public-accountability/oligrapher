import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'

import { useSelector } from '../util/helpers'
import { findConnections } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'
import EditorHeader from './EditorHeader'
import AddConnectionsCategory from './AddConnectionsCategory'
import EntitySearchResults from './EntitySearchResults'
import Graph from '../graph/graph'

/*
  This is the "Add Connections" popup.
  It uses LittleSis /oligrapher/find_connections
  endpoint to get a list of connected entities.

  The results component is <EntityResults>
*/
export default function AddConnections({ id }) {
  const dispatch = useDispatch()
  const graph = useSelector(state => state.graph)
  const { x, y } = useSelector(state => state.graph.nodes[id])
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
    const { edges } = node
    delete node['edges']
    dispatch({ type: 'ADD_NODE', node, position: { x, y } })
    dispatch({ type: 'ADD_EDGES', edges })
    setAddedNodeIds(addedNodeIds.concat([node.id]))
  }, [dispatch, addedNodeIds, x, y])

  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }), [setCategoryId, setResults])

  useEffect(() => {
    setLoading(true)

    const httpRequest = makeCancelable(
      findConnections({entity_id: id, category_id: categoryId})
    )

    httpRequest
      .promise
      .then(results => {
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
    <div className="oligrapher-add-connections">
      <EditorHeader title="Add Connections" />
      <AddConnectionsCategory categoryId={categoryId} onChange={changeCategory} variant="outlined" />
      <br />
      { status }
    </div>
  )
}

AddConnections.propTypes = {
  id: PropTypes.string.isRequired
}
