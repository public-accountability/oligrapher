import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { findNodes } from '../../util/search'
import isArray from 'lodash/isArray'


function SearchResult() {}
function SearchResults() {}

export default function EntitySearch({ query }) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState()

  useEffect(() => {
    setLoading(true)

    findNodes(query)
      .then(json => {
        setLoading(false)
        setResults(json)
      })
      .catch(() => console.error("Error finding nodes"))

  }, [query] )

  if (loading) {
    return <em>...loading...</em>
  } else if (results === false) {
    return <em>error finding nodes</em>
  } else if (isArray(results) && results.length === 0) {
    return <em>no results</em>
  } else {
    return <p>{ JSON.stringify(results, null, 4) }</p>
  }
}


EntitySearch.propTypes = {
  query: PropTypes.string.isRequired
}
