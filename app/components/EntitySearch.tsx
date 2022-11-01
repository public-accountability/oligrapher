import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import isArray from 'lodash/isArray'

import { findNodes } from '../datasources/littlesis3'
import { makeCancelable } from '../util/helpers'

import EntitySearchResults from './EntitySearchResults'

export default function EntitySearch({ query, maxHeight }) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)

  const addNode = useCallback((entity) => {
    dispatch({ type: 'ADD_NODE', node: entity })
  }, [dispatch])

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(findNodes(query))

    httpRequest
      .promise
      .then(json => {
        setResults(json)
        setLoading(false)
      })
      .catch(err => {
        if (!err.isCanceled) {
          setResults(false)
          setLoading(false)
        }
      })

    return httpRequest.cancel
  }, [query])

  let content

  if (loading) {
    content = <em>...loading...</em>
  } else if (isArray(results)) {
    content = results.length === 0
      ? <em>No results.</em>
      : <EntitySearchResults results={results} onClick={addNode} />
  } else {
    content = <em>Your search resulted in an error.</em>
  }

  return (
    <div className="entity-search" style={{ maxHeight, overflowY: 'scroll' }}>
      { content }
    </div>
  )
}

EntitySearch.propTypes = {
  query: PropTypes.string.isRequired,
  maxHeight: PropTypes.number
}
