import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import isArray from 'lodash/isArray'

import { findNodes } from '../datasources/littlesis3'
import { makeCancelable } from '../util/helpers'

import EntitySearchResults from './EntitySearchResults'

export default function EntitySearch({ query }) {
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

  if (loading) {
    return <em>...loading...</em>
  } else if (isArray(results)) {
    return results.length === 0
      ? <em>No results.</em>
      : <EntitySearchResults results={results} onClick={addNode} />
  } else {
    return <em>Your search resulted in an error.</em>
  }
}

EntitySearch.propTypes = {
  query: PropTypes.string.isRequired
}
