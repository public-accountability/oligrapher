import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { findNodes } from '../../util/search'
import { makeCancelable } from '../../util/helpers'
import isArray from 'lodash/isArray'

import EntitySearchResults from './EntitySearchResults'

export default function EntitySearch({ query }) {
  const dispatch = useDispatch()
  const addNode = useCallback(
    attributes => dispatch({ type: 'ADD_NODE', attributes }),
    [dispatch]
  )
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState()

  useEffect(() => {
    setLoading(true)

    const httpRequest =  makeCancelable(findNodes(query))

    httpRequest
      .promise
      .then(json => {
        setLoading(false)
        setResults(json)
      })
      .catch(err => {
        if (!err.isCanceled) {
          setResults(false)
          console.error("Error finding nodes", err)
        }
      })

    return () => httpRequest.cancel()

  }, [query] )

  if (loading) {
    return <em>...loading...</em>
  } else if (isArray(results)) {
    return results.length === 0
      ? <em>no results</em>
      : <EntitySearchResults results={results} addNode={addNode} />
  } else {
    return <em>error</em>
  }
}

EntitySearch.propTypes = {
  query: PropTypes.string.isRequired
}
