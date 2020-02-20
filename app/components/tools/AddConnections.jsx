import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { findConnections } from '../../util/search'
import { makeCancelable } from '../../util/helpers'

import AddConnectionsResults from './AddConnectionsResults'

export default function AddConnections(props) {
  const [results, setResults] = useState(null)

  useEffect(() => {
    //debugger
    const httpRequest = makeCancelable(findConnections(props.entityId))

    httpRequest
      .promise
      .then(json => setResults(json['data']))
      .catch(err => err.isCanceled ? null : console.error("Error finding connections", err))

    return () => httpRequest.cancel()

  }, [props.entityId])

  if (results && results.length > 0) {
    return <AddConnectionsResults results={results}/>
  } else {
    return null
  }
}


AddConnections.propTypes = {
  entityId: PropTypes.number.isRequired
}
